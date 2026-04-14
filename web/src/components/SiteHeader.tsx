import { useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from '@heroui/react'
import WalletButton from '@/components/WalletButton'
import { cnm } from '@/utils/style'

interface NavLink {
  readonly label: string
  readonly to: string
  readonly prefix: string
}

/**
 * Primary nav for CompliBot. The link list is shared between the desktop
 * Navbar row and the mobile menu sheet. `prefix` is the path that should
 * count as "active" — `/cert` matches `/cert`, `/cert/$id`, `/cert/list`, etc.
 * `/` only matches the exact landing path so it does not win against every
 * other route.
 */
const NAV_LINKS: ReadonlyArray<NavLink> = [
  { label: 'Generate', to: '/generate', prefix: '/generate' },
  { label: 'Chat', to: '/chat', prefix: '/chat' },
  { label: 'Audit', to: '/audit', prefix: '/audit' },
  { label: 'Certificates', to: '/cert', prefix: '/cert' },
  { label: 'Dashboard', to: '/dashboard', prefix: '/dashboard' },
]

export default function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  const isActive = (prefix: string) =>
    prefix === '/' ? pathname === '/' : pathname.startsWith(prefix)

  return (
    <Navbar
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      maxWidth="xl"
      isBlurred
      isBordered
      classNames={{
        base: 'bg-[rgba(8,9,10,0.72)] border-b border-[rgba(255,255,255,0.08)] backdrop-saturate-150',
        wrapper: 'h-14 px-4 md:px-6',
        item: 'data-[active=true]:text-[#f7f8f8]',
        menu: 'bg-[#0f1011] pt-6',
      }}
    >
      <NavbarContent justify="start" className="gap-6">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close navigation' : 'Open navigation'}
          className="text-[#8a8f98] md:hidden"
        />
        <NavbarBrand>
          <Link
            to="/"
            className="flex items-center gap-2 text-[15px] font-semibold tracking-[-0.012em] text-[#f7f8f8]"
            onClick={() => setIsMenuOpen(false)}
          >
            <img
              src="/assets/compli-logo.svg"
              alt="CompliBot"
              className="h-24 w-24"
            />
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent
        justify="center"
        className="hidden gap-1 md:flex"
      >
        {NAV_LINKS.map((link) => {
          const active = isActive(link.prefix)
          return (
            <NavbarItem key={link.to} isActive={active}>
              <Link
                to={link.to}
                className={cnm(
                  'rounded-md px-3 py-1.5 text-[13px] font-medium tracking-[-0.011em] transition-colors',
                  active
                    ? 'bg-[#191a1b] text-[#f7f8f8]'
                    : 'text-[#8a8f98] hover:bg-[#191a1b] hover:text-[#f7f8f8]',
                )}
              >
                {link.label}
              </Link>
            </NavbarItem>
          )
        })}
      </NavbarContent>

      <NavbarContent justify="end" className="gap-2">
        <NavbarItem>
          <WalletButton />
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {NAV_LINKS.map((link) => {
          const active = isActive(link.prefix)
          return (
            <NavbarMenuItem key={link.to} isActive={active}>
              <Link
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className={cnm(
                  'block w-full rounded-md px-3 py-2 text-base font-medium tracking-[-0.011em] transition-colors',
                  active
                    ? 'bg-[#191a1b] text-[#f7f8f8]'
                    : 'text-[#d0d6e0] hover:bg-[#191a1b] hover:text-[#f7f8f8]',
                )}
              >
                {link.label}
              </Link>
            </NavbarMenuItem>
          )
        })}
      </NavbarMenu>
    </Navbar>
  )
}
