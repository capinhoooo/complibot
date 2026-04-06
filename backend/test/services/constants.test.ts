import { describe, it, expect } from 'bun:test';
import {
  SEVERITY_WEIGHTS,
  MIN_PASS_SCORE,
  MAX_SCORE,
  getEIP712Domain,
  CERTIFY_TYPES,
  CHAIN_IDS,
  CONTRACTS,
  EIP712_DOMAIN,
  EXPLORERS,
} from '../../src/shared/constants.ts';

describe('Shared Constants', () => {
  describe('Severity Weights', () => {
    it('CRITICAL is the highest weight', () => {
      expect(SEVERITY_WEIGHTS.CRITICAL).toBeGreaterThan(SEVERITY_WEIGHTS.HIGH);
      expect(SEVERITY_WEIGHTS.HIGH).toBeGreaterThan(SEVERITY_WEIGHTS.MEDIUM);
      expect(SEVERITY_WEIGHTS.MEDIUM).toBeGreaterThan(SEVERITY_WEIGHTS.LOW);
      expect(SEVERITY_WEIGHTS.LOW).toBeGreaterThan(SEVERITY_WEIGHTS.INFO);
    });

    it('INFO has zero weight', () => {
      expect(SEVERITY_WEIGHTS.INFO).toBe(0);
    });

    it('has expected specific values', () => {
      expect(SEVERITY_WEIGHTS.CRITICAL).toBe(25);
      expect(SEVERITY_WEIGHTS.HIGH).toBe(15);
      expect(SEVERITY_WEIGHTS.MEDIUM).toBe(5);
      expect(SEVERITY_WEIGHTS.LOW).toBe(2);
    });
  });

  describe('Score thresholds', () => {
    it('MIN_PASS_SCORE is 70', () => {
      expect(MIN_PASS_SCORE).toBe(70);
    });

    it('MAX_SCORE is 100', () => {
      expect(MAX_SCORE).toBe(100);
    });
  });

  describe('getEIP712Domain', () => {
    it('returns domain with correct chainId for testnet', () => {
      const domain = getEIP712Domain(CHAIN_IDS.HASHKEY_TESTNET);
      expect(domain.chainId).toBe(133);
      expect(domain.name).toBe('CompliBot');
      expect(domain.version).toBe('1');
      expect(domain.verifyingContract).toBe(CONTRACTS.COMPLIANCE_REGISTRY);
    });

    it('returns domain with correct chainId for mainnet', () => {
      const domain = getEIP712Domain(CHAIN_IDS.HASHKEY_MAINNET);
      expect(domain.chainId).toBe(177);
    });

    it('prevents cross-chain replay by using different chainIds', () => {
      const testnet = getEIP712Domain(133);
      const mainnet = getEIP712Domain(177);
      expect(testnet.chainId).not.toBe(mainnet.chainId);
    });
  });

  describe('CERTIFY_TYPES', () => {
    it('has CertifyRequest type with expected fields', () => {
      const fields = CERTIFY_TYPES.CertifyRequest;
      expect(fields.length).toBe(5);

      const fieldNames = fields.map(f => f.name);
      expect(fieldNames).toContain('contractAddress');
      expect(fieldNames).toContain('developerAddress');
      expect(fieldNames).toContain('auditHash');
      expect(fieldNames).toContain('complianceScore');
      expect(fieldNames).toContain('nonce');
    });
  });

  describe('Deprecated EIP712_DOMAIN', () => {
    it('is hardcoded to testnet chainId', () => {
      expect(EIP712_DOMAIN.chainId).toBe(CHAIN_IDS.HASHKEY_TESTNET);
    });
  });

  describe('Explorer URLs', () => {
    it('testnet uses hsk.xyz domain', () => {
      expect(EXPLORERS.TESTNET).toContain('hsk.xyz');
    });

    it('mainnet uses blockscout domain', () => {
      expect(EXPLORERS.MAINNET).toContain('blockscout.com');
    });
  });
});
