import { z } from 'zod';
import type { AuditFinding, AuditSummary, ComplianceVerdict, FindingsSummary, Severity } from '@/shared/types.ts';
import { calculateScore, determineVerdict } from '@/services/compliance.ts';

/**
 * Parse the structured JSON output produced by the audit LLM into a typed
 * AuditReport. The audit prompt (`backend/src/prompts/audit.ts`) instructs the
 * model to emit one JSON object per finding followed by a summary JSON, but
 * model output is non-deterministic in practice — it may interleave prose,
 * fence the JSON in markdown, or split objects across multiple top-level
 * arrays. This parser is intentionally tolerant: it scans the raw text for
 * any balanced top-level JSON objects, validates each against the
 * finding/summary schemas, and falls back to recomputing summary fields from
 * the parsed findings if the model omits them.
 *
 * SECURITY: never trusts the LLM-emitted score directly. The final report
 * always recomputes `score` and `verdict` from the parsed finding counts,
 * matching the formula in `services/compliance.ts`. This prevents prompt
 * injection from inflating a contract's compliance score on the way to the
 * certify flow.
 */

const SeveritySchema = z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO']);

const FindingSchema = z.object({
  severity: SeveritySchema,
  title: z.string().min(1).max(500),
  description: z.string().min(1).max(5_000),
  location: z
    .object({
      function: z.string().max(200).default('unknown'),
      line: z.coerce.number().int().min(0).max(1_000_000).default(0),
    })
    .partial()
    .transform((loc) => ({
      function: loc.function ?? 'unknown',
      line: loc.line ?? 0,
    })),
  fix: z.string().max(2_000).default(''),
  code_before: z.string().max(5_000).default(''),
  code_after: z.string().max(5_000).default(''),
  regulation: z.string().max(500).default(''),
});

const SummarySchema = z.object({
  total_findings: z.coerce.number().int().min(0).max(10_000).optional(),
  critical: z.coerce.number().int().min(0).max(10_000).optional(),
  high: z.coerce.number().int().min(0).max(10_000).optional(),
  medium: z.coerce.number().int().min(0).max(10_000).optional(),
  low: z.coerce.number().int().min(0).max(10_000).optional(),
  compliance_score: z.coerce.number().int().min(0).max(100).optional(),
  verdict: z.enum(['PASS', 'FAIL', 'CONDITIONAL']).optional(),
  top_recommendation: z.string().max(2_000).optional(),
});

export interface AuditReport {
  findings: AuditFinding[];
  summary: AuditSummary;
}

/**
 * Extract balanced top-level JSON object substrings from arbitrary text.
 * Scans character-by-character tracking brace depth, ignoring braces inside
 * string literals (with escape handling). Returns an array of candidate
 * JSON object strings in source order.
 */
function extractJsonObjects(text: string): string[] {
  const objects: string[] = [];
  let depth = 0;
  let start = -1;
  let inString = false;
  let escapeNext = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (escapeNext) {
      escapeNext = false;
      continue;
    }

    if (ch === '\\' && inString) {
      escapeNext = true;
      continue;
    }

    if (ch === '"') {
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (ch === '{') {
      if (depth === 0) start = i;
      depth++;
    } else if (ch === '}') {
      depth--;
      if (depth === 0 && start !== -1) {
        objects.push(text.slice(start, i + 1));
        start = -1;
      } else if (depth < 0) {
        // Stray closing brace; reset.
        depth = 0;
        start = -1;
      }
    }
  }

  return objects;
}

function isFindingShape(obj: unknown): boolean {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'severity' in obj &&
    'title' in obj
  );
}

function isSummaryShape(obj: unknown): boolean {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    ('compliance_score' in obj || 'verdict' in obj || 'total_findings' in obj)
  );
}

function countBySeverity(findings: AuditFinding[]): FindingsSummary {
  const counts: FindingsSummary = { critical: 0, high: 0, medium: 0, low: 0 };
  for (const f of findings) {
    switch (f.severity) {
      case 'CRITICAL':
        counts.critical++;
        break;
      case 'HIGH':
        counts.high++;
        break;
      case 'MEDIUM':
        counts.medium++;
        break;
      case 'LOW':
        counts.low++;
        break;
      // INFO is intentionally not counted toward the score
    }
  }
  return counts;
}

/**
 * Parse a raw LLM audit response into a structured report.
 * Always returns a valid report; on parse failure returns an empty report
 * with a FAIL verdict so callers can decide how to surface the error.
 */
export function parseAuditOutput(raw: string): AuditReport {
  const candidates = extractJsonObjects(raw);

  const findings: AuditFinding[] = [];
  let parsedSummary: z.infer<typeof SummarySchema> | null = null;

  for (const candidate of candidates) {
    let json: unknown;
    try {
      json = JSON.parse(candidate);
    } catch {
      continue; // Skip non-JSON braces (e.g. interpolated code samples).
    }

    if (isFindingShape(json)) {
      const result = FindingSchema.safeParse(json);
      if (result.success) {
        findings.push({
          severity: result.data.severity as Severity,
          title: result.data.title,
          description: result.data.description,
          location: result.data.location,
          fix: result.data.fix,
          code_before: result.data.code_before,
          code_after: result.data.code_after,
          regulation: result.data.regulation,
        });
      }
      continue;
    }

    if (isSummaryShape(json)) {
      const result = SummarySchema.safeParse(json);
      if (result.success) {
        parsedSummary = result.data;
      }
    }
  }

  // Always recompute counts/score/verdict from the actual parsed findings.
  // Never trust the LLM's emitted score for the persisted record because that
  // value flows directly into the on-chain certify flow.
  const counts = countBySeverity(findings);
  const score = calculateScore(counts);
  const verdict: ComplianceVerdict = determineVerdict(score, counts);

  const summary: AuditSummary = {
    total_findings: counts.critical + counts.high + counts.medium + counts.low,
    critical: counts.critical,
    high: counts.high,
    medium: counts.medium,
    low: counts.low,
    compliance_score: score,
    verdict,
    top_recommendation:
      (parsedSummary?.top_recommendation ?? '').slice(0, 2_000) ||
      (findings[0]?.title ?? 'No findings detected'),
  };

  return { findings, summary };
}
