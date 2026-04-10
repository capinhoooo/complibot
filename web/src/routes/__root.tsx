import '@/lib/polyfills'

import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useRouterState,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { ToastProvider } from '@heroui/react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import type { QueryClient } from '@tanstack/react-query'
import HeroUIProvider from '@/providers/HeroUIProvider'
import LenisSmoothScrollProvider from '@/providers/LenisSmoothScrollProvider'
import { ThemeProvider } from '@/providers/ThemeProvider'
import Web3Provider from '@/providers/Web3Provider'
import ErrorPage from '@/components/ErrorPage'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import TanStackQueryDevtools from '@/integrations/tanstack-query/devtools'
import { DURATION, EASE } from '@/utils/motion'
import appCss from '@/styles.css?url'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  errorComponent: ({ error, reset }) => (
    <ErrorPage error={error} reset={reset} />
  ),
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      { title: 'CompliBot — Ship compliant DeFi on HashKey Chain' },
      {
        name: 'description',
        content:
          'CompliBot is the HashKey Chain-native compliance copilot for DeFi developers. Ask, audit, and prove on-chain.',
      },
      // Open Graph
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: 'CompliBot — Ship compliant DeFi on HashKey Chain' },
      {
        property: 'og:description',
        content: 'AI compliance copilot for DeFi developers on HashKey Chain. Ask, audit, and prove on-chain.',
      },
      { property: 'og:image', content: '/assets/og-image.svg' },
      { property: 'og:site_name', content: 'CompliBot' },
      // Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'CompliBot — Ship compliant DeFi on HashKey Chain' },
      { name: 'twitter:description', content: 'AI compliance copilot for DeFi developers on HashKey Chain.' },
      { name: 'twitter:image', content: '/assets/og-image.svg' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/assets/compli-logo.svg', type: 'image/svg+xml' },
      { rel: 'apple-touch-icon', href: '/assets/compli-logo.svg' },
      { rel: 'manifest', href: '/manifest.json' },
    ],
  }),

  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        {/* Theme bootstrap must run before body renders to prevent flash. */}
        {/* Only accepts literal 'light' or 'dark' — no JSON.parse (LOW-9/MED-5). */}
        <script src="/theme-bootstrap.js" />
      </head>
      <body className="min-h-screen bg-[var(--color-bg-marketing)] text-[var(--color-fg-primary)] antialiased">
        <ThemeProvider>
          <HeroUIProvider>
            <Web3Provider>
              <ToastProvider placement="bottom-right" />
              <LenisSmoothScrollProvider />
              <AppShell>{children}</AppShell>
              <TanStackDevtools
                config={{ position: 'bottom-right' }}
                plugins={[
                  {
                    name: 'Tanstack Router',
                    render: <TanStackRouterDevtoolsPanel />,
                  },
                  TanStackQueryDevtools,
                ]}
              />
            </Web3Provider>
          </HeroUIProvider>
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  )
}

function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const showFooter = pathname === '/'
  // prefers-reduced-motion: drop y-shift, use 120ms opacity only (§4.3)
  const prefersReduced = useReducedMotion()

  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 overflow-hidden">
        {/* AnimatePresence mode="wait" — one page exits before the next enters. */}
        {/* initial={false} prevents the animation from firing on the first SSR mount. */}
        {/* No exit animation per §4.3 — only entry. */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pathname}
            initial={{
              opacity: 0,
              y: prefersReduced ? 0 : 8,
            }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: prefersReduced ? 0.12 : DURATION.page,
              ease: EASE,
            }}
            style={{ minHeight: '100%' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      {showFooter && <SiteFooter />}
    </div>
  )
}
