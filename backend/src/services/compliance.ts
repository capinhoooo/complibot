import type { FindingsSummary, ComplianceVerdict, AuditSummary } from '@/shared/types.ts';
import { SEVERITY_WEIGHTS, MIN_PASS_SCORE, MAX_SCORE } from '@/shared/constants.ts';

/**
 * Calculate compliance score from finding counts.
 * Score = 100 - (critical * 25 + high * 15 + medium * 5 + low * 2)
 * Minimum score is 0.
 */
export function calculateScore(findings: FindingsSummary): number {
  const deduction =
    findings.critical * SEVERITY_WEIGHTS.CRITICAL +
    findings.high * SEVERITY_WEIGHTS.HIGH +
    findings.medium * SEVERITY_WEIGHTS.MEDIUM +
    findings.low * SEVERITY_WEIGHTS.LOW;

  return Math.max(0, MAX_SCORE - deduction);
}

/**
 * Determine compliance verdict based on score and findings.
 *
 * - PASS: score >= 70 and no critical findings
 * - FAIL: score < 70 or any critical findings
 * - CONDITIONAL: score >= 70 but has high findings
 */
export function determineVerdict(
  score: number,
  findings: FindingsSummary
): ComplianceVerdict {
  if (score < MIN_PASS_SCORE || findings.critical > 0) {
    return 'FAIL';
  }
  if (findings.high > 0) {
    return 'CONDITIONAL';
  }
  return 'PASS';
}

/**
 * Build a complete audit summary from individual finding counts
 * and a top recommendation string.
 */
export function buildAuditSummary(
  findings: FindingsSummary & { info?: number },
  topRecommendation: string
): AuditSummary {
  const totalFindings =
    findings.critical + findings.high + findings.medium + findings.low;
  const score = calculateScore(findings);
  const verdict = determineVerdict(score, findings);

  return {
    total_findings: totalFindings,
    critical: findings.critical,
    high: findings.high,
    medium: findings.medium,
    low: findings.low,
    compliance_score: score,
    verdict,
    top_recommendation: topRecommendation,
  };
}
