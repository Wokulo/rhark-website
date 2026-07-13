# RHARK Website — Developer Documentation

## Architecture Overview

This is a **Next.js 15 App Router** project using **hybrid rendering**:

| Content Type | Strategy | Reason |
|---|---|---|
| Homepage, About, Contact | SSG (Static) | Never changes at request time; fastest TTFB |
| Blog, News, Events | ISR (Incremental Static Regeneration) | Fresh content without full rebuilds |
| Search, Forms | SSR / Client | Dynamic per-request |

---

## Folder Structure

```
src/
├── app/                    # Next.js App Router — pages and API routes
│   ├── layout.tsx          # Root layout: fonts, providers, header, footer
│   ├── page.tsx            # Homepage
│   ├── not-found.tsx       # 404 page
│   ├── error.tsx           # Global error boundary
│   └── globals.css         # Base styles, CSS variables, Tailwind directives
│
├── components/
│   ├── ui/                 # Primitive, reusable atoms (Button, Card, Input…)
│   ├── layout/             # Structural components (Header, Footer, Nav…)
│   ├── home/               # Homepage-specific sections
│   ├── about/              # About page sections
│   ├── programs/           # Programme page sections
│   ├── projects/           # Project page sections
│   ├── news/               # News/blog sections
│   ├── publications/       # Publications sections
│   ├── contact/            # Contact page sections
│   └── shared/             # Cross-cutting components (NewsletterForm, etc.)
│
├── constants/              # Site-wide constants (org info, nav, stats)
├── context/                # React context providers
├── data/                   # Static data (pre-CMS): programmes, team, projects
├── hooks/                  # Custom React hooks
├── lib/                    # Pure utilities: metadata factory, validations
├── providers/              # App-level providers (ThemeProvider)
├── services/               # External service integrations
│   ├── cms/                # Content abstraction layer (swap for Sanity/Contentful)
│   ├── donation/           # M-Pesa Daraja 2.0 stub
│   ├── volunteer/          # Volunteer portal stub
│   ├── auth/               # Authentication stub
│   └── media/              # Media management stub
├── types/                  # TypeScript type definitions
└── utils/                  # Pure utility functions (cn, formatDate, slugify…)
```

---

## Naming Conventions

| Item | Convention | Example |
|---|---|---|
| Components | PascalCase | `HeroSection.tsx` |
| Hooks | camelCase with `use` prefix | `useScrollPosition.ts` |
| Utilities | camelCase | `formatDate.ts` |
| Constants | SCREAMING_SNAKE_CASE | `SITE_NAME` |
| Types/Interfaces | PascalCase | `NewsArticle` |
| CSS classes | kebab-case | `section-padding` |
| Files | PascalCase for components, camelCase for utils | — |

---

## Component Organization Guide

Components follow a strict hierarchy:

1. **`ui/`** — Stateless, generic primitives. No business logic. No RHARK-specific content.
2. **`layout/`** — Structural components that appear on every page.
3. **`sections/`** (inside feature folders) — Page-specific sections. May contain business logic.
4. **`shared/`** — Components used across multiple pages but not generic enough for `ui/`.

**Rule:** A component should only import from the same level or below. `ui/` components never import from `sections/`.

---

## Development Workflow

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Type check
npx tsc --noEmit

# Lint
npm run lint

# Format
npm run format

# Build for production
npm run build
```

### Branch Strategy
```
main        ← production (protected)
staging     ← pre-production QA
develop     ← integration branch
feature/*   ← new features
fix/*       ← bug fixes
```

---

## Coding Standards

- **TypeScript strict mode** is enabled. No `any` types without justification.
- **All form inputs** must use the `Input`/`Textarea`/`Select` components — never raw HTML inputs.
- **All buttons** must use the `Button` component — ensures consistent focus styles and accessibility.
- **All images** must use `next/image` — never raw `<img>` tags.
- **All links** must use `next/link` — never raw `<a>` tags for internal navigation.
- **Class merging** always uses `cn()` from `@/utils` — never raw template literals.
- **No inline styles** — use Tailwind classes only.

---

## Accessibility Standards (WCAG 2.2 AA)

- Every page starts with `<SkipToContent />` as the first focusable element.
- All interactive elements have visible `:focus-visible` styles.
- All images have meaningful `alt` text or `aria-hidden="true"` if decorative.
- All form inputs have associated `<label>` elements (never placeholder-as-label).
- All modals trap focus and restore focus on close.
- Color is never the sole means of conveying information.
- Minimum touch target size: 44×44px on mobile.

---

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in values:

```bash
cp .env.local.example .env.local
```

Never commit `.env.local` — it is in `.gitignore`.

---

## CMS Migration Path

All content is fetched through `src/services/cms/index.ts`.
When a headless CMS is ready:
1. Install the CMS SDK
2. Replace the function bodies in `src/services/cms/index.ts`
3. Zero changes required in any component or page

---

## Adding a New Page

1. Create `src/app/[route]/page.tsx`
2. Export `metadata` using `buildMetadata()` from `@/lib/metadata`
3. Build section components in `src/components/[feature]/`
4. Add the route to `ROUTES` in `src/constants/index.ts`
5. Add to navigation in `NAV_ITEMS` if needed
