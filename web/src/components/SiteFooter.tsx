import { Link } from '@tanstack/react-router'

/**
 * Landing-only footer. The `__root` `AppShell` component conditionally renders
 * this on `pathname === '/'`, so in-app routes (chat, audit, cert, dashboard)
 * never see it. Kept deliberately minimal: brand, tagline, three column
 * groups, copyright line. No socials, no newsletter — this is a demo product,
 * not a marketing site.
 */
export default function SiteFooter() {
  return (
    <footer className="border-t border-[rgba(255,255,255,0.08)] bg-[#0f1011]">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-14 md:flex-row md:gap-16 md:py-16">
        <div className="flex-1 space-y-3">
          <Link
            to="/"
            className="flex items-center gap-2 text-[15px] font-semibold tracking-[-0.012em] text-[#f7f8f8]"
          >
            <img
              src="/assets/compli-logo.svg"
              alt=""
              aria-hidden
              className="h-5 w-5"
            />
            CompliBot
          </Link>
          <p className="max-w-xs text-[13px] leading-relaxed text-[#8a8f98]">
            Ship compliant DeFi on HashKey Chain. Ask, audit, and prove
            on-chain.
          </p>
        </div>

        <div className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-3">
          <FooterColumn title="Product">
            <FooterLink to="/chat">Chat</FooterLink>
            <FooterLink to="/audit">Audit</FooterLink>
            <FooterLink to="/cert">Certificates</FooterLink>
          </FooterColumn>
          <FooterColumn title="Network">
            <FooterExternal href="https://hashkey.cloud/">
              HashKey Chain
            </FooterExternal>
            <FooterExternal href="https://hashkeychain-testnet-explorer.alt.technology">
              Testnet Explorer
            </FooterExternal>
            <FooterExternal href="https://hashkey.blockscout.com">
              Mainnet Explorer
            </FooterExternal>
          </FooterColumn>
          <FooterColumn title="Resources">
            <FooterExternal href="https://github.com/rainbow-me/rainbowkit">
              RainbowKit
            </FooterExternal>
            <FooterExternal href="https://wagmi.sh">Wagmi</FooterExternal>
            <FooterExternal href="https://viem.sh">Viem</FooterExternal>
          </FooterColumn>
        </div>
      </div>

      <div className="border-t border-[rgba(255,255,255,0.05)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 text-[12px] tracking-[-0.006em] text-[#62666d]">
          <span>&copy; {new Date().getFullYear()} CompliBot</span>
          <span>Built on HashKey Chain</span>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#62666d]">
        {title}
      </h3>
      <ul className="space-y-2">{children}</ul>
    </div>
  )
}

function FooterLink({
  to,
  children,
}: {
  to: string
  children: React.ReactNode
}) {
  return (
    <li>
      <Link
        to={to}
        className="text-[13px] text-[#8a8f98] transition-colors hover:text-[#f7f8f8]"
      >
        {children}
      </Link>
    </li>
  )
}

function FooterExternal({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <li>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[13px] text-[#8a8f98] transition-colors hover:text-[#f7f8f8]"
      >
        {children}
      </a>
    </li>
  )
}
