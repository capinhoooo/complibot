import { http } from 'wagmi'
import { hashkey, hashkeyTestnet } from 'viem/chains'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { env } from '@/env'

/**
 * Wagmi config shared by RainbowKit + wagmi v2.
 *
 * The chains order matters: the first chain is the default the wallet will
 * land on. CompliBot targets HashKey Chain (OP Stack L2) — testnet is the
 * demo default (chain id 133), mainnet (177) is optional and only reachable
 * via the chain switcher.
 *
 * `ssr: true` is required because TanStack Start renders routes on the
 * server. Without it, wagmi crashes during the SSR pass trying to read
 * `window`.
 */
if (env.VITE_WC_PROJECT_ID === 'complibot-dev-wc-id') {
  console.warn(
    '[wagmi] VITE_WC_PROJECT_ID is the development placeholder. ' +
      'WalletConnect will not work. Set a real project ID from https://cloud.reown.com.',
  )
}

export const wagmiConfig = getDefaultConfig({
  appName: 'CompliBot',
  projectId: env.VITE_WC_PROJECT_ID,
  chains:
    env.VITE_HASHKEY_CHAIN_ID === 177
      ? [hashkey, hashkeyTestnet]
      : [hashkeyTestnet, hashkey],
  transports: {
    [hashkey.id]: http(env.VITE_HASHKEY_RPC_URL),
    [hashkeyTestnet.id]: http(env.VITE_HASHKEY_TESTNET_RPC_URL),
  },
  ssr: true,
})

export const activeChainId = env.VITE_HASHKEY_CHAIN_ID
export const activeExplorerUrl =
  activeChainId === 177
    ? env.VITE_MAINNET_EXPLORER_URL
    : env.VITE_TESTNET_EXPLORER_URL
