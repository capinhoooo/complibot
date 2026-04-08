// eslint-disable-next-line node/prefer-node-protocol -- browser `buffer` package, not node:buffer; see JSDoc below.
import { Buffer } from 'buffer'

/**
 * Browser Buffer shim. Wagmi, viem, and RainbowKit's transitive dependencies
 * (notably WalletConnect + some Coinbase SDK packages) assume a global
 * `Buffer`. Vite's browser bundle does not ship Node's `node:buffer`, so we
 * import the userland `buffer` package and install it on `window` +
 * `globalThis` before any wallet code runs.
 *
 * This file is imported by `src/routes/__root.tsx` as a bare side-effect
 * import, so it executes at the top of the client entry. Do not re-export.
 */
if (typeof window !== 'undefined') {
  const w = window as unknown as { Buffer?: typeof Buffer }
  const g = globalThis as unknown as { Buffer?: typeof Buffer }
  if (!w.Buffer) w.Buffer = Buffer
  if (!g.Buffer) g.Buffer = Buffer
}
