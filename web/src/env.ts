import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

const hexAddress = z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid EVM address')

export const env = createEnv({
  server: {
    SERVER_URL: z.string().url().optional(),
  },

  clientPrefix: 'VITE_',

  client: {
    VITE_APP_TITLE: z.string().min(1).default('CompliBot'),
    VITE_API_URL: z.string().url().default('http://localhost:3001'),
    VITE_WC_PROJECT_ID: z.string().min(1).default('complibot-dev-wc-id'),
    VITE_HASHKEY_CHAIN_ID: z.coerce.number().int().default(133),
    VITE_REGISTRY_ADDRESS: hexAddress.default(
      '0x47B320A4ED999989AE3065Be28B208f177a7546D',
    ),
    VITE_EAS_ADAPTER_ADDRESS: hexAddress.default(
      '0xd8EcF5D6D77bF2852c5e9313F87f31cc99c38dE9',
    ),
    VITE_KYC_CONTRACT_ADDRESS: hexAddress.default(
      '0xBbe362BB261657bbD7202EB623DDBe6ED6a156b6',
    ),
    VITE_TESTNET_EXPLORER_URL: z
      .string()
      .url()
      .default('https://hashkeychain-testnet-explorer.alt.technology'),
    VITE_MAINNET_EXPLORER_URL: z
      .string()
      .url()
      .default('https://hashkey.blockscout.com'),
    VITE_HASHKEY_RPC_URL: z.string().url().optional(),
    VITE_HASHKEY_TESTNET_RPC_URL: z.string().url().optional(),
  },

  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
})
