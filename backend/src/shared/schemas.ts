import { z } from 'zod';

// ---- Message schema (shared across streaming routes) ----

const MessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  // Max 20KB per message. Combined with max 50 messages, total payload stays
  // well within the 1MB bodyLimit configured in Fastify.
  // Previous value of 100KB per message would allow 5MB total in messages alone,
  // bypassing the 1MB body limit since JSON parsing happens before Zod validation.
  content: z.string().min(1).max(20_000),
});

// ---- @ai-sdk/react useChat UIMessage schema (AI SDK v6) ----
//
// `useChat` v6 sends messages with a `parts` array (NOT a `content` string).
// The chat route accepts this shape directly so we can call
// `convertToModelMessages()` and stream back via `toUIMessageStreamResponse()`.
// We only validate the fields the route reads; unknown part types are tolerated
// because the SDK may extend the union (reasoning, files, tool calls, etc.).

const UIMessageTextPartSchema = z.object({
  type: z.literal('text'),
  text: z.string().min(1).max(20_000),
  state: z.enum(['streaming', 'done']).optional(),
});

// Permissive catch-all for non-text parts so future SDK additions don't break
// validation. The route only feeds these to convertToModelMessages, which is
// the authoritative consumer of the part shape.
const UIMessagePartSchema = z.union([
  UIMessageTextPartSchema,
  z.object({ type: z.string() }).passthrough(),
]);

const UIMessageSchema = z.object({
  id: z.string().min(1).max(100),
  role: z.enum(['system', 'user', 'assistant']),
  // Cap part count per message to keep parsing cost bounded.
  parts: z.array(UIMessagePartSchema).min(1).max(50),
  metadata: z.unknown().optional(),
});

export const ChatRequestSchema = z.object({
  // useChat sends `messages` by default. Mirror the shape verbatim.
  messages: z.array(UIMessageSchema).min(1).max(50),
  // Optional id field that useChat passes through (chat session id from the client).
  id: z.string().min(1).max(100).optional(),
});

// ---- Route request schemas ----

export const GenerateSchema = z.object({
  messages: z.array(MessageSchema).min(1).max(50),
});

export const RegQuerySchema = z.object({
  messages: z.array(MessageSchema).min(1).max(50),
});

export const AuditSchema = z.object({
  messages: z.array(MessageSchema).max(50).default([]),
  contractCode: z.string().min(20).max(50_000).optional(),
  contractName: z.string().max(100).optional(),
  targetChain: z.enum(['hashkey_mainnet', 'hashkey_testnet']).default('hashkey_testnet'),
  // Optional wallet address persisted on the AuditSession row so the certify
  // flow can later attach a certificate to a known developer identity.
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address').optional(),
});

// CertifyRequestSchema uses .strict() to reject any extra fields.
// This prevents mass assignment attacks where an attacker might try to inject
// fields like "score", "isAdmin", or other properties that could influence
// downstream processing.
export const CertifyRequestSchema = z.object({
  contractAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid contract address'),
  developerAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid developer address'),
  auditSessionId: z.string().min(1).max(100),
  complianceScore: z.number().int().min(70).max(100),
  findingsSummary: z.object({
    critical: z.number().int().min(0).max(255),
    high: z.number().int().min(0).max(255),
    medium: z.number().int().min(0).max(255),
    low: z.number().int().min(0).max(255),
  }).strict(),
  signature: z.string().regex(/^0x[a-fA-F0-9]+$/, 'Invalid signature format').max(200),
  nonce: z.number().int().min(0).max(Number.MAX_SAFE_INTEGER),
}).strict();

export const CertifyResponseSchema = z.object({
  attestationUid: z.string(),
  txHash: z.string(),
  schemaUid: z.string(),
  explorerUrl: z.string(),
  certificateUrl: z.string(),
  timestamp: z.string(),
});

export const AddressParamSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
});

export const CertificateDetailParamSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
  uid: z.string().min(1),
});

// ---- Type exports from schemas ----

export type GenerateRequest = z.infer<typeof GenerateSchema>;
export type RegQueryRequest = z.infer<typeof RegQuerySchema>;
export type AuditRequest = z.infer<typeof AuditSchema>;
export type ChatRequest = z.infer<typeof ChatRequestSchema>;
export type CertifyRequest = z.infer<typeof CertifyRequestSchema>;
export type CertifyResponse = z.infer<typeof CertifyResponseSchema>;
