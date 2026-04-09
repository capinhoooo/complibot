import { z } from 'zod'
import { isAddress } from 'viem'
import { apiClient } from '@/lib/api/client'

const FindingsSummarySchema = z.object({
  critical: z.number(),
  high: z.number(),
  medium: z.number(),
  low: z.number(),
})

const txHashSchema = z.string().regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid tx hash')
const explorerUrlSchema = z
  .string()
  .url()
  .refine((u) => /^https:\/\//i.test(u), 'explorerUrl must be https')

export const CertSummarySchema = z.object({
  attestationUid: z.string(),
  txHash: txHashSchema,
  contractAddress: z.string(),
  developerAddress: z.string(),
  score: z.number(),
  findings: FindingsSummarySchema,
  explorerUrl: explorerUrlSchema,
  createdAt: z.string(),
})

export type CertSummary = z.infer<typeof CertSummarySchema>

const ListResponseSchema = z.object({
  certificates: z.array(CertSummarySchema),
})

const AuditSessionSchema = z.object({
  id: z.string(),
  score: z.number(),
  verdict: z.string(),
  createdAt: z.string(),
})

// Category score as returned by an extended backend (optional — derived client-side if absent)
const CategoryScoreSchema = z.object({
  label: z.string(),
  score: z.number().min(0).max(1),
})

export const CertDetailSchema = z.object({
  attestationUid: z.string(),
  txHash: txHashSchema,
  schemaUid: z.string(),
  contractAddress: z.string(),
  developerAddress: z.string(),
  score: z.number(),
  findings: FindingsSummarySchema,
  explorerUrl: explorerUrlSchema,
  createdAt: z.string(),
  auditSession: AuditSessionSchema.optional(),
  // TODO: add these fields to the backend /api/certs/:address/:uid response
  kycLevel: z.number().int().min(0).optional(),
  blockNumber: z.number().optional(),
  confirmations: z.number().optional(),
  categories: z.array(CategoryScoreSchema).optional(),
})

export type CertDetail = z.infer<typeof CertDetailSchema>

const DetailResponseSchema = z.object({
  certificate: CertDetailSchema,
})

export async function listCertificates(
  address: string,
  signal?: AbortSignal,
): Promise<Array<CertSummary>> {
  if (!isAddress(address)) throw new Error('Invalid address')
  const raw = await apiClient.get<unknown>(`/api/certs/${address}`, signal)
  return ListResponseSchema.parse(raw).certificates
}

export async function getCertificate(
  address: string,
  uid: string,
  signal?: AbortSignal,
): Promise<CertDetail> {
  if (!isAddress(address)) throw new Error('Invalid address')
  const raw = await apiClient.get<unknown>(`/api/certs/${address}/${uid}`, signal)
  return DetailResponseSchema.parse(raw).certificate
}
