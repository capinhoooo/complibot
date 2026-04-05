/**
 * EAS Schema Registration Script
 *
 * Registers the CompliBot compliance attestation schema on HashKey Chain's
 * EAS SchemaRegistry predeploy (0x4200000000000000000000000000000000000020).
 *
 * Usage: bun run scripts/register-schema.ts
 * Requires: RPC_URL, ATTESTER_PRIVATE_KEY, CHAIN_ID
 *
 * After running, copy the printed COMPLIBOT_SCHEMA_UID to your .env file.
 */

import 'dotenv/config';
import { publicClient, walletClient } from '../src/lib/viem.ts';
import { EAS_SCHEMA_STRING } from '../src/shared/constants.ts';

const SCHEMA_REGISTRY_ADDRESS = '0x4200000000000000000000000000000000000020' as const;

const SCHEMA_REGISTRY_ABI = [
  {
    name: 'register',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'schema', type: 'string' },
      { name: 'resolver', type: 'address' },
      { name: 'revocable', type: 'bool' },
    ],
    outputs: [{ name: '', type: 'bytes32' }],
  },
] as const;

async function registerSchema() {
  if (!walletClient) {
    console.error('FATAL: ATTESTER_PRIVATE_KEY not set. Cannot register schema.');
    process.exit(1);
  }

  console.log('Registering CompliBot EAS schema on HashKey Chain...');
  console.log(`Schema: ${EAS_SCHEMA_STRING}`);
  console.log(`Registry: ${SCHEMA_REGISTRY_ADDRESS}`);
  console.log(`Account: ${walletClient.account.address}`);

  const { request } = await publicClient.simulateContract({
    address: SCHEMA_REGISTRY_ADDRESS,
    abi: SCHEMA_REGISTRY_ABI,
    functionName: 'register',
    args: [
      EAS_SCHEMA_STRING,
      '0x0000000000000000000000000000000000000000', // no resolver
      true, // revocable
    ],
    account: walletClient.account,
  });

  const txHash = await walletClient.writeContract(request);
  console.log('Transaction hash:', txHash);

  const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
  console.log('Transaction confirmed in block:', receipt.blockNumber);

  // The schemaUID is returned as the first topic of the Registered event
  const schemaUid = receipt.logs[0]?.topics?.[1];
  console.log('\nSchema UID:', schemaUid);
  console.log('\nAdd this to your .env file:');
  console.log(`COMPLIBOT_SCHEMA_UID=${schemaUid}`);
}

registerSchema().catch((error) => {
  console.error('Schema registration failed:', error);
  process.exit(1);
});
