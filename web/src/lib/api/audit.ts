import { z } from 'zod'
import { apiClient } from '@/lib/api/client'

const FindingSchema = z.object({
  severity: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO']),
  title: z.string(),
  description: z.string(),
  location: z.object({
    function: z.string().default('unknown'),
    line: z.number().default(0),
  }).optional(),
  fix: z.string().optional(),
  code_before: z.string().optional(),
  code_after: z.string().optional(),
  regulation: z.string().optional(),
})

const AuditResponseSchema = z.object({
  auditSessionId: z.string().min(1),
  score: z.number().min(0).max(100),
  verdict: z.enum(['compliant', 'needs_review', 'non_compliant']),
  findingsSummary: z.object({
    critical: z.number(),
    high: z.number(),
    medium: z.number(),
    low: z.number(),
  }),
  findings: z.array(FindingSchema),
  summary: z.object({
    compliance_score: z.number(),
    verdict: z.string(),
    critical: z.number(),
    high: z.number(),
    medium: z.number(),
    low: z.number(),
    total_findings: z.number().optional(),
    top_recommendation: z.string().optional(),
  }),
  rawOutput: z.string().optional(),
  createdAt: z.string(),
})

export type AuditFinding = z.infer<typeof FindingSchema>
export type AuditResponse = z.infer<typeof AuditResponseSchema>

interface RunAuditParams {
  contractCode: string
  contractName?: string
  walletAddress?: `0x${string}`
}

export async function runAudit(
  params: RunAuditParams,
  signal?: AbortSignal,
): Promise<AuditResponse> {
  const raw = await apiClient.post<unknown>(
    '/api/audit',
    {
      contractCode: params.contractCode,
      contractName: params.contractName,
      walletAddress: params.walletAddress,
      messages: [],
    },
    signal,
  )
  return AuditResponseSchema.parse(raw)
}
