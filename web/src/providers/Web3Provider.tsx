import { WagmiProvider } from 'wagmi'
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import type { Theme } from '@rainbow-me/rainbowkit'
import { wagmiConfig } from '@/lib/wagmi'

/**
 * Linear-tuned RainbowKit dark theme.
 *
 * We start from `darkTheme({ accentColor, borderRadius, overlayBlur })` and
 * patch a handful of colors so the connect modal matches the `#08090a` /
 * `#0f1011` Linear surface stack. `accentColor` pins the brand indigo so the
 * primary button inside the modal tracks the rest of the app's palette.
 */
const linearDarkTheme: Theme = (() => {
  const base = darkTheme({
    accentColor: '#5e6ad2',
    accentColorForeground: '#ffffff',
    borderRadius: 'medium',
    fontStack: 'system',
    overlayBlur: 'small',
  })

  return {
    ...base,
    colors: {
      ...base.colors,
      modalBackground: '#0f1011',
      modalBorder: 'rgba(255, 255, 255, 0.08)',
      modalBackdrop: 'rgba(0, 0, 0, 0.85)',
      menuItemBackground: '#191a1b',
      profileForeground: '#0f1011',
      profileAction: '#191a1b',
      profileActionHover: '#28282c',
      generalBorder: 'rgba(255, 255, 255, 0.08)',
      generalBorderDim: 'rgba(255, 255, 255, 0.05)',
    },
  }
})()

export default function Web3Provider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <RainbowKitProvider theme={linearDarkTheme} modalSize="compact">
        {children}
      </RainbowKitProvider>
    </WagmiProvider>
  )
}
