import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Button } from '@heroui/react'
import { cnm } from '@/utils/style'

/**
 * Wallet connect button wired to RainbowKit's headless `ConnectButton.Custom`
 * renderer. We drive everything through HeroUI `Button` so the connected/
 * disconnected states match the rest of the Linear palette (brand indigo
 * `#5e6ad2` solid when connected, ghost outline when not).
 *
 * State matrix:
 *  - unmounted / SSR pass          -> `opacity-0` placeholder, no interaction
 *  - disconnected                  -> "Connect Wallet" (brand solid)
 *  - wrong chain                   -> "Wrong network" (danger, opens chain modal)
 *  - connected                     -> chain chip + account chip (2 buttons)
 *
 * The two connected chips are intentionally separate buttons. The chain chip
 * opens the chain switcher (HashKey mainnet <> testnet), the account chip
 * opens the account modal (disconnect / copy address / explorer link). This
 * mirrors RainbowKit's default but with our own typography and radii.
 */
export default function WalletButton() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted
        const connected = ready && account && chain

        return (
          <div
            aria-hidden={!ready}
            className={cnm(
              'flex items-center gap-2',
              !ready && 'pointer-events-none select-none opacity-0',
            )}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    color="primary"
                    radius="md"
                    size="sm"
                    onPress={openConnectModal}
                    className="font-medium tracking-[-0.011em]"
                  >
                    Connect Wallet
                  </Button>
                )
              }

              if (chain.unsupported) {
                return (
                  <Button
                    color="danger"
                    radius="md"
                    size="sm"
                    onPress={openChainModal}
                    className="font-medium tracking-[-0.011em]"
                  >
                    Wrong network
                  </Button>
                )
              }

              return (
                <>
                  <Button
                    variant="flat"
                    radius="md"
                    size="sm"
                    onPress={openChainModal}
                    className="hidden bg-[#191a1b] font-medium tracking-[-0.011em] text-[#d0d6e0] hover:bg-[#28282c] sm:inline-flex"
                    startContent={
                      chain.hasIcon ? (
                        <div
                          aria-hidden
                          className="h-3 w-3 overflow-hidden rounded-full"
                          style={{ background: chain.iconBackground }}
                        >
                          {chain.iconUrl ? (
                            <img
                              src={chain.iconUrl}
                              alt=""
                              className="h-3 w-3"
                            />
                          ) : null}
                        </div>
                      ) : null
                    }
                  >
                    {chain.name ?? 'Unknown'}
                  </Button>
                  <Button
                    variant="flat"
                    radius="md"
                    size="sm"
                    onPress={openAccountModal}
                    className="bg-[#191a1b] font-medium tracking-[-0.011em] text-[#f7f8f8] hover:bg-[#28282c]"
                  >
                    {account.displayName}
                    {account.displayBalance
                      ? ` · ${account.displayBalance}`
                      : ''}
                  </Button>
                </>
              )
            })()}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}
