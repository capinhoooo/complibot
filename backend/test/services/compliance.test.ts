import { describe, it, expect } from 'bun:test';
import { calculateScore, determineVerdict, buildAuditSummary } from '../../src/services/compliance.ts';

describe('Compliance Service', () => {
  describe('calculateScore', () => {
    it('returns 100 for no findings', () => {
      expect(calculateScore({ critical: 0, high: 0, medium: 0, low: 0 })).toBe(100);
    });

    it('deducts 25 per critical finding', () => {
      expect(calculateScore({ critical: 1, high: 0, medium: 0, low: 0 })).toBe(75);
      expect(calculateScore({ critical: 2, high: 0, medium: 0, low: 0 })).toBe(50);
    });

    it('deducts 15 per high finding', () => {
      expect(calculateScore({ critical: 0, high: 1, medium: 0, low: 0 })).toBe(85);
      expect(calculateScore({ critical: 0, high: 2, medium: 0, low: 0 })).toBe(70);
    });

    it('deducts 5 per medium finding', () => {
      expect(calculateScore({ critical: 0, high: 0, medium: 1, low: 0 })).toBe(95);
      expect(calculateScore({ critical: 0, high: 0, medium: 4, low: 0 })).toBe(80);
    });

    it('deducts 2 per low finding', () => {
      expect(calculateScore({ critical: 0, high: 0, medium: 0, low: 1 })).toBe(98);
      expect(calculateScore({ critical: 0, high: 0, medium: 0, low: 5 })).toBe(90);
    });

    it('calculates combined deductions correctly', () => {
      // 1 critical (25) + 1 high (15) + 2 medium (10) + 3 low (6) = 56 deduction
      expect(calculateScore({ critical: 1, high: 1, medium: 2, low: 3 })).toBe(44);
    });

    it('never returns below 0', () => {
      expect(calculateScore({ critical: 5, high: 5, medium: 5, low: 5 })).toBe(0);
      expect(calculateScore({ critical: 10, high: 0, medium: 0, low: 0 })).toBe(0);
    });
  });

  describe('determineVerdict', () => {
    it('returns PASS for score >= 70 and no critical or high findings', () => {
      expect(determineVerdict(100, { critical: 0, high: 0, medium: 0, low: 0 })).toBe('PASS');
      expect(determineVerdict(70, { critical: 0, high: 0, medium: 5, low: 10 })).toBe('PASS');
    });

    it('returns FAIL for score < 70', () => {
      expect(determineVerdict(69, { critical: 0, high: 0, medium: 0, low: 0 })).toBe('FAIL');
      expect(determineVerdict(0, { critical: 0, high: 0, medium: 0, low: 0 })).toBe('FAIL');
    });

    it('returns FAIL for any critical findings regardless of score', () => {
      expect(determineVerdict(100, { critical: 1, high: 0, medium: 0, low: 0 })).toBe('FAIL');
      expect(determineVerdict(75, { critical: 1, high: 0, medium: 0, low: 0 })).toBe('FAIL');
    });

    it('returns CONDITIONAL for score >= 70 with high findings but no critical', () => {
      expect(determineVerdict(85, { critical: 0, high: 1, medium: 0, low: 0 })).toBe('CONDITIONAL');
      expect(determineVerdict(70, { critical: 0, high: 2, medium: 1, low: 3 })).toBe('CONDITIONAL');
    });

    it('FAIL takes precedence over CONDITIONAL when critical > 0', () => {
      expect(determineVerdict(75, { critical: 1, high: 1, medium: 0, low: 0 })).toBe('FAIL');
    });
  });

  describe('buildAuditSummary', () => {
    it('builds complete summary with correct totals', () => {
      const summary = buildAuditSummary(
        { critical: 0, high: 1, medium: 2, low: 3 },
        'Add reentrancy guard to transfer function'
      );

      expect(summary.total_findings).toBe(6);
      expect(summary.critical).toBe(0);
      expect(summary.high).toBe(1);
      expect(summary.medium).toBe(2);
      expect(summary.low).toBe(3);
      expect(summary.compliance_score).toBe(69); // 100 - 15 - 10 - 6 = 69
      expect(summary.verdict).toBe('FAIL'); // score 69 < 70
      expect(summary.top_recommendation).toBe('Add reentrancy guard to transfer function');
    });

    it('returns PASS verdict for clean audit', () => {
      const summary = buildAuditSummary(
        { critical: 0, high: 0, medium: 1, low: 2 },
        'Minor improvements suggested'
      );

      expect(summary.compliance_score).toBe(91); // 100 - 5 - 4
      expect(summary.verdict).toBe('PASS');
    });

    it('returns FAIL verdict for critical findings', () => {
      const summary = buildAuditSummary(
        { critical: 2, high: 1, medium: 0, low: 0 },
        'Critical: missing KYC verification'
      );

      expect(summary.compliance_score).toBe(35); // 100 - 50 - 15
      expect(summary.verdict).toBe('FAIL');
    });
  });
});
