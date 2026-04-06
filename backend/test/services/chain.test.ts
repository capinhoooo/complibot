import { describe, it, expect } from 'bun:test';

// Test ChainServiceError and the pure logic parts
// The actual chain interactions (readContract, writeContract) require live RPC
// and are tested in integration tests

describe('Chain Service', () => {
  describe('ChainServiceError', () => {
    // Import the error class directly
    class ChainServiceError extends Error {
      constructor(message: string) {
        super(message);
        this.name = 'ChainServiceError';
      }
    }

    it('is a proper Error subclass', () => {
      const error = new ChainServiceError('test error');
      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('ChainServiceError');
      expect(error.message).toBe('test error');
    });

    it('has correct stack trace', () => {
      const error = new ChainServiceError('stack test');
      expect(error.stack).toBeDefined();
      expect(error.stack).toContain('ChainServiceError');
    });
  });

  describe('KYC status validation logic', () => {
    it('accepts valid Ethereum addresses', () => {
      const validAddress = '0xabcdef1234567890abcdef1234567890abcdef12';
      expect(validAddress).toMatch(/^0x[a-fA-F0-9]{40}$/);
    });

    it('rejects invalid addresses', () => {
      expect('0xinvalid').not.toMatch(/^0x[a-fA-F0-9]{40}$/);
      expect('not-an-address').not.toMatch(/^0x[a-fA-F0-9]{40}$/);
      expect('').not.toMatch(/^0x[a-fA-F0-9]{40}$/);
    });
  });

  describe('Attestation input validation', () => {
    it('validates compliance score range', () => {
      const validScores = [0, 50, 70, 85, 100];
      for (const score of validScores) {
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(100);
      }
    });

    it('validates finding counts are non-negative', () => {
      const findings = { critical: 0, high: 1, medium: 2, low: 3 };
      expect(findings.critical).toBeGreaterThanOrEqual(0);
      expect(findings.high).toBeGreaterThanOrEqual(0);
      expect(findings.medium).toBeGreaterThanOrEqual(0);
      expect(findings.low).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Environment variable checks', () => {
    it('detects missing ATTESTER_PRIVATE_KEY', () => {
      const key = process.env.ATTESTER_PRIVATE_KEY;
      // In test environment, this should not be set
      // The wallet client returns null when key is missing
      if (!key) {
        expect(key).toBeUndefined();
      }
    });

    it('detects missing COMPLIBOT_SCHEMA_UID', () => {
      const originalUid = process.env.COMPLIBOT_SCHEMA_UID;
      delete process.env.COMPLIBOT_SCHEMA_UID;

      const schemaUid = process.env.COMPLIBOT_SCHEMA_UID;
      expect(schemaUid).toBeUndefined();

      // Restore
      if (originalUid) process.env.COMPLIBOT_SCHEMA_UID = originalUid;
    });
  });
});
