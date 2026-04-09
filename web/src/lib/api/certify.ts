/**
 * EIP-712 certify flow.
 *
 * The frontend NEVER calls issueCertificate directly.
 * The registry is ATTESTER_ROLE-gated — only the backend attester wallet writes.
 * Frontend signs the EIP-712 payload and POSTs the signature.
 *
 * Types verified against backend/src/shared/constants.ts CERTIFY_TYPES:
 *   contractAddress, developerAddress, auditHash, complianceScore, nonce
 *
 * NOTE: DESIGN.md §8.6 listed different field names (walletAddress, deadline) —
 * those are wrong. The backend is authoritative.
 */
import { keccak256, toHex } from 'viem'
import { z } from 'zod'
import { env } from '@/env'
import { apiClient } from '@/lib/api/client'

export const CERTIFY_DOMAIN = {
  name: 'CompliBot',
  version: '1',
  chainId: env.VITE_HASHKEY_CHAIN_ID,
  verifyingContract: env.VITE_REGISTRY_ADDRESS as `0x${string}`,
} as const

export const CERTIFY_TYPES = {
  CertifyRequest: [
    { name: 'contractAddress', type: 'address' },
    { name: 'developerAddress', type: 'address' },
    { name: 'auditHash', type: 'bytes32' },
    { name: 'complianceScore', type: 'uint256' },
    { name: 'nonce', type: 'uint256' },
  ],
} as const

export interface CertifyMessage {
  contractAddress: `0x${string}`
  developerAddress: `0x${string}`
  auditHash: `0x${string}`
  complianceScore: bigint
  nonce: bigint
}

/** Derive auditHash from the auditSessionId — must match backend keccak256(toHex(id)) */
export function deriveAuditHash(auditSessionId: string): `0x${string}` {
  return keccak256(toHex(auditSessionId))
}

const CertifyResponseSchema = z.object({
  attestationUid: z.string(),
  txHash: z.string(),
  schemaUid: z.string(),
  explorerUrl: z.string(),
  certificateUrl: z.string(),
  timestamp: z.string(),
})

export type CertifyResponse = z.infer<typeof CertifyResponseSchema>

export async function postCertify(body: {
  contractAddress: `0x${string}`
  developerAddress: `0x${string}`
  auditSessionId: string
  complianceScore: number
  findingsSummary: {
    critical: number
    high: number
    medium: number
    low: number
  }
  signature: `0x${string}`
  // bigint from crypto.getRandomValues — converted to number for the wire
  // because the backend schema uses z.number().int(). We generate only 4 bytes
  // so the value stays within Number.MAX_SAFE_INTEGER.
  nonce: bigint
}): Promise<CertifyResponse> {
  const raw = await apiClient.post<unknown>('/api/certify', {
    ...body,
    nonce: Number(body.nonce),
  })
  return CertifyResponseSchema.parse(raw)
}
