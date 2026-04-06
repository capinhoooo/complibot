import { describe, it, expect } from 'bun:test';
import { calculateScore, determineVerdict, buildAuditSummary } from '../../src/services/compliance.ts';

describe('Compliance Service: Edge Cases', () => {
  describe('calculateScore edge cases', () => {
    it('returns exact boundary score of 70 (1 high + 3 medium)', () => {
      // 100 - 15 - 15 = 70
      expect(calculateScore({ critical: 0, high: 2, medium: 0, low: 0 })).toBe(70);
    });

    it('returns 69 just below pass threshold', () => {
      // 100 - 15 - 10 - 6 = 69
      expect(calculateScore({ critical: 0, high: 1, medium: 2, low: 3 })).toBe(69);
    });

    it('handles extremely large finding counts without going negative', () => {
      expect(calculateScore({ critical: 100, high: 100, medium: 100, low: 100 })).toBe(0);
    });

    it('handles all zeros correctly', () => {
      expect(calculateScore({ critical: 0, high: 0, medium: 0, low: 0 })).toBe(100);
    });

    it('correctly applies each severity weight individually', () => {
      // Verify each weight matches SEVERITY_WEIGHTS constants
      expect(calculateScore({ critical: 1, high: 0, medium: 0, low: 0 })).toBe(75); // -25
      expect(calculateScore({ critical: 0, high: 1, medium: 0, low: 0 })).toBe(85); // -15
      expect(calculateScore({ critical: 0, high: 0, medium: 1, low: 0 })).toBe(95); // -5
      expect(calculateScore({ critical: 0, high: 0, medium: 0, low: 1 })).toBe(98); // -2
    });
  });

  describe('determineVerdict boundary conditions', () => {
    it('PASS at exactly score 70 with no critical or high', () => {
      expect(determineVerdict(70, { critical: 0, high: 0, medium: 6, low: 0 })).toBe('PASS');
    });

    it('FAIL at score 69 even with no findings', () => {
      expect(determineVerdict(69, { critical: 0, high: 0, medium: 0, low: 0 })).toBe('FAIL');
    });

    it('FAIL at score 100 with critical findings', () => {
      expect(determineVerdict(100, { critical: 1, high: 0, medium: 0, low: 0 })).toBe('FAIL');
    });

    it('CONDITIONAL at score 70 with high findings', () => {
      expect(determineVerdict(70, { critical: 0, high: 1, medium: 0, low: 0 })).toBe('CONDITIONAL');
    });

    it('FAIL takes priority over CONDITIONAL (critical + high)', () => {
      expect(determineVerdict(80, { critical: 1, high: 1, medium: 0, low: 0 })).toBe('FAIL');
    });

    it('FAIL when score is exactly 0', () => {
      expect(determineVerdict(0, { critical: 0, high: 0, medium: 0, low: 0 })).toBe('FAIL');
    });

    it('PASS at score 100 with only low findings', () => {
      expect(determineVerdict(100, { critical: 0, high: 0, medium: 0, low: 10 })).toBe('PASS');
    });
  });

  describe('buildAuditSummary with info field', () => {
    it('ignores info field in total_findings count', () => {
      const summary = buildAuditSummary(
        { critical: 0, high: 0, medium: 1, low: 1, info: 5 },
        'Add access control'
      );
      // info findings should not count toward total
      expect(summary.total_findings).toBe(2);
      expect(summary.compliance_score).toBe(93); // 100 - 5 - 2
      expect(summary.verdict).toBe('PASS');
    });

    it('produces CONDITIONAL verdict for high findings with passing score', () => {
      const summary = buildAuditSummary(
        { critical: 0, high: 1, medium: 0, low: 0 },
        'Address reentrancy'
      );
      expect(summary.compliance_score).toBe(85);
      expect(summary.verdict).toBe('CONDITIONAL');
      expect(summary.high).toBe(1);
    });

    it('includes correct top_recommendation in output', () => {
      const rec = 'Implement KYC gate on all external functions';
      const summary = buildAuditSummary(
        { critical: 0, high: 0, medium: 0, low: 0 },
        rec
      );
      expect(summary.top_recommendation).toBe(rec);
      expect(summary.compliance_score).toBe(100);
      expect(summary.verdict).toBe('PASS');
    });
  });
});
