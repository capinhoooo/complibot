/** Severity levels for audit findings, ordered by impact */
export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

/** Compliance verdict after audit scoring */
export type ComplianceVerdict = 'PASS' | 'FAIL' | 'CONDITIONAL';

/** Location of a finding within the contract source */
export interface FindingLocation {
  function: string;
  line: number;
}

/** A single audit finding from the AuditAssist analysis */
export interface AuditFinding {
  severity: Severity;
  title: string;
  description: string;
  location: FindingLocation;
  fix: string;
  code_before: string;
  code_after: string;
  regulation: string;
}

/** Summary produced at the end of an audit */
export interface AuditSummary {
  total_findings: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  compliance_score: number;
  verdict: ComplianceVerdict;
  top_recommendation: string;
}

/** Findings summary for certification requests */
export interface FindingsSummary {
  critical: number;
  high: number;
  medium: number;
  low: number;
}

/** Certificate response from the certify endpoint */
export interface CertificateResponse {
  attestationUid: string;
  txHash: string;
  schemaUid: string;
  explorerUrl: string;
  certificateUrl: string;
  timestamp: string;
}

/** Health check response */
export interface HealthResponse {
  status: 'healthy' | 'unhealthy';
  database: 'connected' | 'disconnected';
  timestamp?: string;
}

/** Certificate list item for the explorer */
export interface CertificateListItem {
  attestationUid: string;
  txHash: string;
  contractAddress: string;
  developerAddress: string;
  score: number;
  findings: FindingsSummary;
  explorerUrl: string;
  createdAt: string;
}

/** Target chain for audit */
export type TargetChain = 'hashkey_mainnet' | 'hashkey_testnet';
