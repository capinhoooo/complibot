import {
  createPublicClient,
  createWalletClient,
  http,
  defineChain,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { HASHKEY_CHAIN_ID, ATTESTER_PRIVATE_KEY } from '@/config/main-config.ts';

// HashKey Chain Testnet (Chain ID 133)
export const hashkeyTestnet = defineChain({
  id: 133,
  name: 'HashKey Chain Testnet',
  nativeCurrency: { name: 'HashKey EcoPoints', symbol: 'HSK', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://testnet.hsk.xyz'] },
  },
  blockExplorers: {
    default: { name: 'Blockscout', url: 'https://testnet-explorer.hsk.xyz' },
  },
  testnet: true,
});

// HashKey Chain Mainnet (Chain ID 177)
export const hashkeyMainnet = defineChain({
  id: 177,
  name: 'HashKey Chain',
  nativeCurrency: { name: 'HashKey EcoPoints', symbol: 'HSK', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://mainnet.hsk.xyz'] },
  },
  blockExplorers: {
    default: { name: 'Blockscout', url: 'https://hashkey.blockscout.com' },
  },
});

// Select chain based on CHAIN_ID config
const chain =
  HASHKEY_CHAIN_ID === '177' ? hashkeyMainnet : hashkeyTestnet;

// Public client for read operations (KYC checks, receipt lookups)
export const publicClient = createPublicClient({
  chain,
  transport: http(process.env.RPC_URL),
});

// Wallet client for write operations (EAS attestations)
// Only initialized if ATTESTER_PRIVATE_KEY is set
function createAttesterWalletClient() {
  if (!ATTESTER_PRIVATE_KEY || ATTESTER_PRIVATE_KEY === '0x...' || ATTESTER_PRIVATE_KEY.length < 66) {
    return null;
  }
  const account = privateKeyToAccount(ATTESTER_PRIVATE_KEY as `0x${string}`);
  return createWalletClient({
    account,
    chain,
    transport: http(process.env.RPC_URL),
  });
}

export const walletClient = createAttesterWalletClient();

// Export the selected chain for use in other modules
export { chain as currentChain };
