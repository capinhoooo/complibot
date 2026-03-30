import { encodeAbiParameters, parseAbiParameters } from 'viem';
import { publicClient, walletClient } from '@/lib/viem.ts';
import {
  KYC_CONTRACT_ADDRESS,
  KYC_BYPASS_FOR_TESTING,
  IS_DEV,
  COMPLIBOT_SCHEMA_UID,
} from '@/config/main-config.ts';

// ---- KYC SBT ABI (read-only functions) ----

const KYC_ABI = [
  {
    name: 'isHuman',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [
      { name: 'isValid', type: 'bool' },
      { name: 'level', type: 'uint8' },
    ],
  },
  {
    name: 'getKycInfo',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [
      { name: 'ensName', type: 'string' },
      { name: 'level', type: 'uint8' },
      { name: 'status', type: 'uint8' },
      { name: 'createTime', type: 'uint256' },
    ],
  },
] as const;

// ---- EAS Predeploy ABI (attest function) ----

const EAS_ABI = [
  {
    name: 'attest',
    type: 'function',
    stateMutability: 'payable',
    inputs: [
      {
        name: 'request',
        type: 'tuple',
        components: [
          { name: 'schema', type: 'bytes32' },
          {
            name: 'data',
            type: 'tuple',
            components: [
              { name: 'recipient', type: 'address' },
              { name: 'expirationTime', type: 'uint64' },
              { name: 'revocable', type: 'bool' },
              { name: 'refUID', type: 'bytes32' },
              { name: 'data', type: 'bytes' },
              { name: 'value', type: 'uint256' },
            ],
          },
        ],
      },
    ],
    outputs: [{ name: '', type: 'bytes32' }],
  },
] as const;

const EAS_ADDRESS = '0x4200000000000000000000000000000000000021' as const;
const ZERO_BYTES32 = '0x0000000000000000000000000000000000000000000000000000000000000000' as const;

// ---- KYC Check ----

export async function checkKycStatus(address: `0x${string}`): Promise<{
  isValid: boolean;
  level: number;
}> {
  // Use centralized config instead of process.env directly.
  // This ensures startup validation in main-config.ts catches missing values.
  const kycAddress = KYC_CONTRACT_ADDRESS as `0x${string}` | undefined;

  if (!kycAddress) {
    // KYC contract address is required in ALL environments.
    // Use KYC_BYPASS_FOR_TESTING=true ONLY in local development with testnet.
    if (KYC_BYPASS_FOR_TESTING && IS_DEV) {
      console.warn('[Chain] KYC BYPASSED: KYC_BYPASS_FOR_TESTING is set. Do NOT use in production.');
      return { isValid: true, level: 1 };
    }
    throw new ChainServiceError('KYC contract address not configured');
  }

  try {
    const [isValid, level] = await publicClient.readContract({
      address: kycAddress,
      abi: KYC_ABI,
      functionName: 'isHuman',
      args: [address],
    });
    return { isValid, level };
  } catch (error) {
    // Log error without exposing raw error object to avoid leaking RPC details
    console.error('[Chain] KYC check failed for address:', address);
    // NEVER fail open. If KYC service is unavailable, deny the request.
    throw new ChainServiceError('KYC verification service unavailable');
  }
}

// ---- EAS Attestation ----

export interface AttestationInput {
  contractAddress: `0x${string}`;
  developerAddress: `0x${string}`;
  complianceScore: number;
  auditHash: `0x${string}`;
  criticalFindings: number;
  highFindings: number;
  mediumFindings: number;
  lowFindings: number;
}

export interface AttestationResult {
  uid: string;
  txHash: string;
  schemaUid: string;
}

export async function createAttestation(input: AttestationInput): Promise<AttestationResult> {
  if (!walletClient) {
    throw new ChainServiceError('Attester wallet not configured (ATTESTER_PRIVATE_KEY missing)');
  }

  // Use centralized config for schema UID
  const schemaUid = COMPLIBOT_SCHEMA_UID as `0x${string}`;
  if (!schemaUid) {
    throw new ChainServiceError('COMPLIBOT_SCHEMA_UID not set. Run scripts/register-schema.ts first.');
  }

  // Encode attestation data matching the EAS schema
  const encodedData = encodeAbiParameters(
    parseAbiParameters(
      'address contractAddress, address developerAddress, uint8 complianceScore, bytes32 auditHash, string version, uint8 criticalFindings, uint8 highFindings, uint8 mediumFindings, uint8 lowFindings'
    ),
    [
      input.contractAddress,
      input.developerAddress,
      input.complianceScore,
      input.auditHash,
      '1.0.0',
      input.criticalFindings,
      input.highFindings,
      input.mediumFindings,
      input.lowFindings,
    ]
  );

  // Simulate the transaction first to catch errors before spending gas
  const { request } = await publicClient.simulateContract({
    address: EAS_ADDRESS,
    abi: EAS_ABI,
    functionName: 'attest',
    args: [
      {
        schema: schemaUid,
        data: {
          recipient: input.developerAddress,
          expirationTime: 0n,
          revocable: true,
          refUID: ZERO_BYTES32,
          data: encodedData,
          value: 0n,
        },
      },
    ],
    account: walletClient.account,
  });

  const txHash = await walletClient.writeContract(request);
  const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

  // Extract attestation UID from the Attested event log
  const attestedLog = receipt.logs.find(
    (log) => log.address.toLowerCase() === EAS_ADDRESS.toLowerCase()
  );
  const uid = attestedLog?.topics?.[1] ?? txHash;

  return { uid, txHash, schemaUid };
}

// ---- Custom Error ----

export class ChainServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ChainServiceError';
  }
}
