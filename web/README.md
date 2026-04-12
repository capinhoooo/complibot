<p align="center">
  <img src="public/assets/compli-logo.svg" width="56" height="56" alt="CompliBot" />
</p>

<h1 align="center">CompliBot Web</h1>

<p align="center">
  <strong>Frontend application for CompliBot</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/TanStack_Start-FF4154?style=flat-square&logo=react&logoColor=white" alt="TanStack Start" />
  <img src="https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/HeroUI-000?style=flat-square" alt="HeroUI" />
  <img src="https://img.shields.io/badge/Tailwind_4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white" alt="Motion" />
  <img src="https://img.shields.io/badge/wagmi-35495E?style=flat-square" alt="wagmi" />
  <img src="https://img.shields.io/badge/Vite_7-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
</p>

---

## Overview

The CompliBot web app is a five-page product built on **TanStack Start** (SSR-capable React 19 meta-framework). It wraps three backend capabilities (RegQuery, AuditAssist, Certificate) behind a precision dark UI inspired by Linear, built with HeroUI components and Tailwind CSS 4.

---

## Commands

```bash
bun dev        # Dev server on port 3200 (HMR)
bun build      # Production build (SSR via Nitro)
bun preview    # Preview production build locally
bun lint       # ESLint
bun format     # Prettier
bun check      # Format + lint fix
bun test       # Run Vitest tests
```

---

## Routes

| Route | File | Description |
|:------|:-----|:------------|
| `/` | `routes/index.tsx` | Landing page with hero, problem statement, capabilities, knowledge base |
| `/generate` | `routes/generate/index.tsx` | Contract generator. Natural language in, streaming Solidity out |
| `/chat` | `routes/chat/index.tsx` | RegQuery chat. RAG-powered Q&A with citation chips, conversation history (localStorage) |
| `/audit` | `routes/audit/index.tsx` | AuditAssist split-pane. Code editor left, findings report right, score gauge, certify flow |
| `/cert` | `routes/cert/index.tsx` | Certificate viewer. Lookup by wallet or attestation UID, explorer links |
| `/dashboard` | `routes/dashboard/index.tsx` | Developer dashboard. Audit history, certificates, stats |

### Root Layout (`__root.tsx`)

The root layout wraps all routes with:

- **ThemeProvider**: Dark/light mode via CSS variables
- **HeroUIProvider**: Component library theming
- **Web3Provider**: wagmi + RainbowKit + TanStack Query for wallet connectivity
- **LenisSmoothScrollProvider**: Smooth scrolling
- **SiteHeader**: Navigation + wallet button + chain badge
- **SiteFooter**: Only shown on landing page
- **AnimatePresence**: Page transition animations (opacity + y-shift)

---

## Structure

```
src/
 |- routes/                     File-based routing (TanStack Router)
 |   |- __root.tsx              Root layout with all providers
 |   |- index.tsx               Landing page
 |   |- generate/index.tsx      Contract generator
 |   |- chat/index.tsx          RegQuery chat interface
 |   |- audit/index.tsx         Audit split-pane + certify flow
 |   |- cert/index.tsx          Certificate viewer
 |   +- dashboard/index.tsx     Developer dashboard
 |
 |- components/                 Shared UI components
 |   |- SiteHeader.tsx          Top nav bar with wallet connection
 |   |- SiteFooter.tsx          Footer (landing page only)
 |   |- WalletButton.tsx        RainbowKit connect button wrapper
 |   |- ScoreGauge.tsx          Animated circular score display (0-100)
 |   |- CategoryBars.tsx        KYC / Limits / Reporting / Access bar chart
 |   |- CodeSnippet.tsx         Syntax-highlighted code block (Shiki)
 |   |- RegulationCitation.tsx  Regulation reference card with links
 |   |- EmptyState.tsx          Centered empty state with icon + CTA
 |   |- LoadingSkeleton.tsx     Shimmer loading placeholder
 |   +- ErrorPage.tsx           Full-page error boundary
 |
 |- lib/
 |   |- api/                    Backend API clients
 |   |   |- client.ts           Base fetch wrapper (apiClient.get/post)
 |   |   |- audit.ts            runAudit() with Zod response validation
 |   |   |- certify.ts          EIP-712 domain/types, postCertify()
 |   |   |- certificates.ts     Certificate lookup API
 |   |   +- generate.ts         Contract generation helpers
 |   |- contracts/
 |   |   +- abi/                Contract ABIs for on-chain reads
 |   |- wagmi.ts                Chain config (HashKey testnet/mainnet)
 |   +- polyfills.ts            Buffer polyfill for browser
 |
 |- providers/
 |   |- HeroUIProvider.tsx      HeroUI + router integration
 |   |- LenisSmoothScrollProvider.tsx   Smooth scroll init
 |   |- ThemeProvider.tsx       Dark/light mode context
 |   +- Web3Provider.tsx        wagmi + RainbowKit + QueryClient
 |
 |- hooks/
 |   +- useLocalStorage.ts      Persistent state with quota-exceeded handling
 |
 |- utils/
 |   |- style.ts                cnm() = clsx + tailwind-merge
 |   +- motion.ts               Shared animation constants (DURATION, EASE, STAGGER)
 |
 |- config.ts                   App config constants
 |- env.ts                      Typed environment variables (Zod + t3-env)
 |- router.tsx                  Router setup
 +- styles.css                  Global styles, scrollbar, selection
```

---

## Key Patterns

### API Communication

All backend calls go through `lib/api/client.ts`:

```ts
import { apiClient } from '@/lib/api/client'

// JSON endpoints
const data = await apiClient.post<ResponseType>('/api/audit', body)
const data = await apiClient.get<ResponseType>('/api/certs/0x...')

// Streaming endpoints use AI SDK's useChat hook
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
```

- **Streaming routes** (`/api/generate`, `/api/regquery`): Use `useChat` from `@ai-sdk/react` with `DefaultChatTransport` pointing at the backend SSE endpoint
- **JSON routes** (`/api/audit`, `/api/certify`): Use `apiClient.post()` with Zod schema validation on the response

### Wallet Integration

```
Web3Provider (wagmi config)
  -> RainbowKit (connect UI)
    -> useAccount() (address, chain)
    -> useSignTypedData() (EIP-712 for certify)
    -> useReadContract() (KYC SBT check)
```

Supported chains: HashKey Chain Testnet (133), HashKey Chain Mainnet (177).

### Styling

- **Tailwind CSS 4** with `@import "tailwindcss"` syntax
- **HeroUI** dark theme configured in `hero.ts` (project root)
- **Design tokens**: All colors use explicit hex values from the DESIGN.md spec
- **`cnm()`**: Utility that merges `clsx` + `tailwind-merge` for conditional classes
- **Motion**: Framer Motion v12 (`motion/react`) for page transitions, list staggering, and micro-interactions

### Animation Constants

```ts
// utils/motion.ts
export const DURATION = { page: 0.28, entry: 0.32, micro: 0.12 }
export const EASE = [0.16, 1, 0.3, 1]  // custom ease-out
export const STAGGER = { list: 0.04, grid: 0.06 }
```

---

## Environment Variables

Create a `.env` file or configure via Vite's env loading:

| Variable | Description |
|:---------|:------------|
| `VITE_API_URL` | Backend API base URL (default: `http://localhost:3001`) |
| `VITE_WC_PROJECT_ID` | WalletConnect project ID (for RainbowKit) |

---

## Design Decisions

| Decision | Rationale |
|:---------|:----------|
| TanStack Start over Next.js | Full-stack React with TanStack Router. No vendor lock-in. |
| HeroUI over shadcn/ui | Pre-built accessible components. Faster to ship for hackathon. |
| Framer Motion over GSAP | Better React integration. GSAP kept only for existing AnimateComponent. |
| localStorage for chat history | No auth system yet. Chat sessions are client-only. |
| No rehype-raw in Markdown | Prevents XSS from LLM output. Only safe markdown features rendered. |
| Zod validation on API responses | Catches backend/frontend schema mismatches at parse time. |

---

## Deployment

```bash
bun build                 # Outputs to .output/
```

Deploy the `.output/` directory to Vercel (configured via `vercel.json`) or any Node.js host. The app uses SSR via Nitro, so it needs a server runtime.
