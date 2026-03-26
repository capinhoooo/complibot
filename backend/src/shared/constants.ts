// ---- Deployed Contract Addresses (HashKey Chain Testnet) ----

export const CONTRACTS = {
  MOCK_KYC_SBT: '0xBbe362BB261657bbD7202EB623DDBe6ED6a156b6' as const,
  COMPLIANCE_REGISTRY: '0x47B320A4ED999989AE3065Be28B208f177a7546D' as const,
  COMPLIBOT_EAS: '0xd8EcF5D6D77bF2852c5e9313F87f31cc99c38dE9' as const,
  EAS: '0x4200000000000000000000000000000000000021' as const,
  SCHEMA_REGISTRY: '0x4200000000000000000000000000000000000020' as const,
} as const;

// ---- Chain IDs ----

export const CHAIN_IDS = {
  HASHKEY_TESTNET: 133,
  HASHKEY_MAINNET: 177,
} as const;

// ---- Block Explorer URLs ----

export const EXPLORERS = {
  TESTNET: 'https://testnet-explorer.hsk.xyz',
  MAINNET: 'https://hashkey.blockscout.com',
} as const;

// ---- RPC URLs ----

export const RPC_URLS = {
  TESTNET: 'https://testnet.hsk.xyz',
  MAINNET: 'https://mainnet.hsk.xyz',
} as const;

// ---- Compliance Scoring ----

export const SEVERITY_WEIGHTS = {
  CRITICAL: 25,
  HIGH: 15,
  MEDIUM: 5,
  LOW: 2,
  INFO: 0,
} as const;

export const MIN_PASS_SCORE = 70;
export const MAX_SCORE = 100;

// ---- EIP-712 Domain and Types for CertifyRequest ----

/**
 * Returns the EIP-712 domain for the given chain ID.
 * The chainId MUST match the chain the backend is connected to,
 * preventing cross-chain signature replay attacks.
 */
export function getEIP712Domain(chainId: number) {
  return {
    name: 'CompliBot',
    version: '1',
    chainId,
    verifyingContract: CONTRACTS.COMPLIANCE_REGISTRY,
  } as const;
}

/** @deprecated Use getEIP712Domain(chainId) instead. Hardcoded to testnet. */
export const EIP712_DOMAIN = {
  name: 'CompliBot',
  version: '1',
  chainId: CHAIN_IDS.HASHKEY_TESTNET,
  verifyingContract: CONTRACTS.COMPLIANCE_REGISTRY,
} as const;

export const CERTIFY_TYPES = {
  CertifyRequest: [
    { name: 'contractAddress', type: 'address' },
    { name: 'developerAddress', type: 'address' },
    { name: 'auditHash', type: 'bytes32' },
    { name: 'complianceScore', type: 'uint256' },
    { name: 'nonce', type: 'uint256' },
  ],
} as const;

// ---- EAS Schema ----

export const EAS_SCHEMA_STRING =
  'address contractAddress, address developerAddress, uint8 complianceScore, bytes32 auditHash, string version, uint8 criticalFindings, uint8 highFindings, uint8 mediumFindings, uint8 lowFindings';

export const COMPLIBOT_VERSION = '1.0.0';
