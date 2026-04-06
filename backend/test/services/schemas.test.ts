import { describe, it, expect } from 'bun:test';
import {
  GenerateSchema,
  RegQuerySchema,
  AuditSchema,
  CertifyRequestSchema,
  AddressParamSchema,
  CertificateDetailParamSchema,
} from '../../src/shared/schemas.ts';

describe('Zod Validation Schemas', () => {
  describe('GenerateSchema', () => {
    it('rejects empty messages array', () => {
      const result = GenerateSchema.safeParse({ messages: [] });
      expect(result.success).toBe(false);
    });

    it('rejects messages with empty content', () => {
      const result = GenerateSchema.safeParse({
        messages: [{ role: 'user', content: '' }],
      });
      expect(result.success).toBe(false);
    });

    it('rejects invalid role', () => {
      const result = GenerateSchema.safeParse({
        messages: [{ role: 'system', content: 'test' }],
      });
      expect(result.success).toBe(false);
    });

    it('accepts valid user message', () => {
      const result = GenerateSchema.safeParse({
        messages: [{ role: 'user', content: 'Build a token' }],
      });
      expect(result.success).toBe(true);
    });

    it('rejects more than 50 messages', () => {
      const messages = Array.from({ length: 51 }, (_, i) => ({
        role: i % 2 === 0 ? 'user' : 'assistant',
        content: `Message ${i}`,
      }));
      const result = GenerateSchema.safeParse({ messages });
      expect(result.success).toBe(false);
    });

    it('accepts exactly 50 messages', () => {
      const messages = Array.from({ length: 50 }, (_, i) => ({
        role: i % 2 === 0 ? 'user' : 'assistant',
        content: `Message ${i}`,
      }));
      const result = GenerateSchema.safeParse({ messages });
      expect(result.success).toBe(true);
    });

    it('rejects message content exceeding 100k chars', () => {
      const result = GenerateSchema.safeParse({
        messages: [{ role: 'user', content: 'x'.repeat(100_001) }],
      });
      expect(result.success).toBe(false);
    });
  });

  describe('AuditSchema', () => {
    it('rejects contractCode below 20 chars', () => {
      const result = AuditSchema.safeParse({
        messages: [{ role: 'user', content: 'Audit this' }],
        contractCode: 'too short',
      });
      expect(result.success).toBe(false);
    });

    it('accepts contractCode above 20 chars', () => {
      const result = AuditSchema.safeParse({
        messages: [{ role: 'user', content: 'Audit this' }],
        contractCode: 'pragma solidity ^0.8.24; contract Test {}',
      });
      expect(result.success).toBe(true);
    });

    it('rejects contractCode exceeding 50k chars', () => {
      const result = AuditSchema.safeParse({
        messages: [{ role: 'user', content: 'Audit' }],
        contractCode: 'x'.repeat(50_001),
      });
      expect(result.success).toBe(false);
    });

    it('defaults targetChain to hashkey_testnet', () => {
      const result = AuditSchema.safeParse({
        messages: [{ role: 'user', content: 'Audit this contract' }],
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.targetChain).toBe('hashkey_testnet');
      }
    });

    it('rejects invalid targetChain', () => {
      const result = AuditSchema.safeParse({
        messages: [{ role: 'user', content: 'Audit' }],
        targetChain: 'ethereum',
      });
      expect(result.success).toBe(false);
    });

    it('accepts hashkey_mainnet as targetChain', () => {
      const result = AuditSchema.safeParse({
        messages: [{ role: 'user', content: 'Audit' }],
        targetChain: 'hashkey_mainnet',
      });
      expect(result.success).toBe(true);
    });

    it('rejects contractName exceeding 100 chars', () => {
      const result = AuditSchema.safeParse({
        messages: [{ role: 'user', content: 'Audit' }],
        contractName: 'x'.repeat(101),
      });
      expect(result.success).toBe(false);
    });
  });

  describe('CertifyRequestSchema', () => {
    const validPayload = {
      contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
      developerAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
      auditSessionId: 'session-123',
      complianceScore: 85,
      findingsSummary: { critical: 0, high: 0, medium: 1, low: 2 },
      signature: '0xaabb',
      nonce: 0,
    };

    it('rejects score below 70', () => {
      const result = CertifyRequestSchema.safeParse({
        ...validPayload,
        complianceScore: 69,
      });
      expect(result.success).toBe(false);
    });

    it('accepts score exactly 70', () => {
      const result = CertifyRequestSchema.safeParse({
        ...validPayload,
        complianceScore: 70,
      });
      expect(result.success).toBe(true);
    });

    it('rejects score above 100', () => {
      const result = CertifyRequestSchema.safeParse({
        ...validPayload,
        complianceScore: 101,
      });
      expect(result.success).toBe(false);
    });

    it('rejects non-hex contract address', () => {
      const result = CertifyRequestSchema.safeParse({
        ...validPayload,
        contractAddress: '0xGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG',
      });
      expect(result.success).toBe(false);
    });

    it('rejects address without 0x prefix', () => {
      const result = CertifyRequestSchema.safeParse({
        ...validPayload,
        contractAddress: '1234567890abcdef1234567890abcdef12345678',
      });
      expect(result.success).toBe(false);
    });

    it('rejects address too short', () => {
      const result = CertifyRequestSchema.safeParse({
        ...validPayload,
        contractAddress: '0x1234',
      });
      expect(result.success).toBe(false);
    });

    it('rejects negative nonce', () => {
      const result = CertifyRequestSchema.safeParse({
        ...validPayload,
        nonce: -1,
      });
      expect(result.success).toBe(false);
    });

    it('rejects negative finding counts', () => {
      const result = CertifyRequestSchema.safeParse({
        ...validPayload,
        findingsSummary: { critical: -1, high: 0, medium: 0, low: 0 },
      });
      expect(result.success).toBe(false);
    });

    it('rejects invalid signature format', () => {
      const result = CertifyRequestSchema.safeParse({
        ...validPayload,
        signature: 'not-hex',
      });
      expect(result.success).toBe(false);
    });

    it('rejects empty auditSessionId', () => {
      const result = CertifyRequestSchema.safeParse({
        ...validPayload,
        auditSessionId: '',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('AddressParamSchema', () => {
    it('accepts valid lowercase address', () => {
      const result = AddressParamSchema.safeParse({
        address: '0xabcdef1234567890abcdef1234567890abcdef12',
      });
      expect(result.success).toBe(true);
    });

    it('accepts valid mixed-case address', () => {
      const result = AddressParamSchema.safeParse({
        address: '0xAbCdEf1234567890AbCdEf1234567890AbCdEf12',
      });
      expect(result.success).toBe(true);
    });

    it('rejects empty string', () => {
      const result = AddressParamSchema.safeParse({ address: '' });
      expect(result.success).toBe(false);
    });

    it('rejects address without 0x prefix', () => {
      const result = AddressParamSchema.safeParse({
        address: 'abcdef1234567890abcdef1234567890abcdef12',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('CertificateDetailParamSchema', () => {
    it('accepts valid address and uid', () => {
      const result = CertificateDetailParamSchema.safeParse({
        address: '0xabcdef1234567890abcdef1234567890abcdef12',
        uid: '0xschema123',
      });
      expect(result.success).toBe(true);
    });

    it('rejects empty uid', () => {
      const result = CertificateDetailParamSchema.safeParse({
        address: '0xabcdef1234567890abcdef1234567890abcdef12',
        uid: '',
      });
      expect(result.success).toBe(false);
    });
  });
});
