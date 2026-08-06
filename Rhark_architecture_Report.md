# RHARK Platform — Architecture & Technical Documentation

**Document Version:** 1.0  
**Date:** August 2026  
**Author:** Lead Software Architect  
**Scope:** Full-stack analysis of the RHARK website & staff portal (Next.js + Supabase)

---

## 1. PROJECT OVERVIEW

### 1.1 Purpose

The RHARK platform is the digital presence for **Reproductive Health Action and Rights Kenya (RHARK)** — a Community-Based Organization (CBO) in Siaya County, Kenya. The platform serves four purposes:

1. **Public-facing website** — communicates RHARK's mission, programmes (SRHR, mental health, gender equality, HIV prevention, governance, climate justice), projects, impact metrics, news, events, publications and media.
2. **Donation platform** — accepts donations via M-Pesa STK Push and bank transfer instructions.
3. **Public engagement forms** — contact, volunteer applications, partnership inquiries, internship applications and newsletter subscriptions.
4. **Staff content-management portal** — role-based admin for managing news, events, projects, gallery, partners, publications, team, documents, volunteers, donations, contacts, newsletter and site settings.

### 1.2 Technologies

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16.2 (App Router, React Server Components) |
| **UI Library** | React 19.0 |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 3.4 + custom design tokens |
| **Animation** | Framer Motion 11.15 |
| **Icons** | Lucide React 0.468 |
| **Forms** | React Hook Form 7.54 + Zod 3.24 + @hookform/resolvers |
| **Database / Backend** | Supabase (PostgreSQL + Auth + Storage) |
| **Rich Text** | Tiptap (React, StarterKit, Image, Link, Placeholder) |
| **Charts** | Recharts 3.10 (Dashboard) |
| **Email** | Nodemailer 9 |
| **Payments** | M-Pesa Daraja API (STK Push + Query) |
| **Linting** | ESLint 9 + eslint-config-next |
| **Formatting** | Prettier + prettier-plugin-tailwindcss |
| **Image optimization** | Next/Image + sharp |
| **ORM (dependency)** | Prisma 7 (installed, **not used** — Supabase replaces it) |

### 1.3 Runtime

- **Node** ≥ 18.18 (engines field)
- **Deployment target**: Vercel
- **Package manager**: npm (package-lock.json present)

### 1.4 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Next.js 16 App                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ Public Pages │  │ API Routes   │  │ Staff Portal (/admin)│  │
│  │ (RSC + CSR)  │  │ (Route Handlers)││ (Role-based access) │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘  │
│         │                 │                     │               │
│  ┌──────▼─────────────────▼─────────────────────▼───────────┐  │
│  │              Service Layer (src/services)                │  │
│  │  Auth • CMS • Events • News • Gallery • Partners •       │  │
│  │  Publications • Volunteer • Donation • Programmes        │  │
│  └──────┬─────────────────┬─────────────────────┬───────────┘  │
│         │                 │                     │               │
│  ┌──────▼───────┐  ┌──────▼──────┐  ┌──────────▼───────────┐  │
│  │   Supabase   │  │   Supabase  │  │   Third-party APIs   │  │
│  │  PostgreSQL  │  │    Auth     │  │  M-Pesa • Nodemailer │  │
│  │  + Storage   │  │  (GoTrue)   │  │                      │  │
│  └──────────────┘  └─────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

**Application model:** Hybrid rendering. Public pages use Server Components with a client-component island for interactions (nav, forms, animations). The staff portal is entirely client-rendered behind authentication. Middleware refreshes Supabase sessions and guards `/admin/*` routes.

---

## 2. COMPLETE FOLDER STRUCTURE

```
RHARK/
├── .env.local.example          # Environment variable template
├── .gitignore
├── .prettierrc                 # Prettier config
├── ARCHITECTURE.md             # Legacy high-level architecture notes
├── RHARK_WEBSITE_DOCUMENTATION_REPORT.md
├── middleware.ts               # Supabase session refresh + /admin guard
├── next.config.ts              # Security headers, images, basePath, compression
├── package.json                # Dependencies & scripts
├── tailwind.config.ts          # Design tokens: colors, type, spacing, z-index
├── tsconfig.json
├── eslint.config.mjs
├── postcss.config.js
├── public/
│   ├── images/                 # Hero images, partner logos, og-default.jpg
│   ├── videos/                 # rhark-story.mp4
│   ├── fonts/                  # Self-hosted fonts
│   └── documents/              # Public downloads
├── scripts/
│   └── write-pages.js          # Generator script (static pages)
├── supabase/
│   └── migrations/             # 8 SQL migrations (schema + seeds)
└── src/
    ├── app/                    # Next.js App Router (pages, layouts, API)
    ├── components/             # React components
    ├── config/                 # App configuration
    ├── constants/              # ORG, ROUTES, NAV_ITEMS, SOCIAL_LINKS
    ├── context/                # React context (AuthContext)
    ├── data/                   # Static fallback data (programmes, projects, team, content)
    ├── hooks/                  # Custom React hooks
    ├── lib/                    # Core libraries (auth, email, rbac, supabase, upload, validations)
    ├── providers/              # Client providers (ThemeProvider, Providers)
    ├── services/               # Data-access layer (Supabase + static fallbacks)
    ├── styles/                 # Global styles
    ├── types/                  # TypeScript types (index.ts, supabase.ts)
    └── utils/                  # cn() and helpers
```

### Key folder purposes

| Folder | Purpose |
|--------|---------|
| `src/app` | App Router — every folder maps to a URL route. `layout.tsx` is the root layout; `api/` contains route handlers (API endpoints). |
| `src/components` | UI components. Sub-folders: `home` (section components), `layout` (Header/Footer/ScrollToTop/CookieConsent), `admin` (AdminLayout), `system/ui` (design-system primitives: Button, Input, Textarea, Select, Modal, Alert), `seo` (JsonLd), `contact`, `news`, `programs`, `projects`, `publications`, `shared`, `about`. |
| `src/lib` | Business-critical logic. `supabase/` (client + server + middleware), `mpesa/` (Daraja API), `store/` (in-memory fallback store), `email.ts` (Nodemailer), `auth.ts`, `rbac.ts` (roles/permissions), `upload.ts` (file upload), `validations.ts` (Zod schemas), `admin-utils.ts`, `admin.server.ts`, `metadata.ts` (SEO factory). |
| `src/services` | Data access. Each domain has its own module: `cms`, `news`, `events`, `gallery`, `partners`, `publications`, `homepage`, `programmes`, `volunteer`, `donation`, `auth`, `media`. Mixes static-data fallbacks and live Supabase calls. |
| `src/context` | `AuthContext` — session state, role utilities, `useAuth()` hook. |
| `src/hooks` | `useFocusTrap`, `useIntersectionObserver`, `useMediaQuery`, `useScrollPosition`. |
| `src/types` | `index.ts` (domain types: Programme, Project, NewsArticle, Event…) and `supabase.ts` (generated DB types). |
| `src/constants` | Centralized brand/org/route/nav constants. |
| `src/data` | Static seed data used by CMS service as fallback until Supabase rows exist. |
| `public` | Static assets: images, videos, fonts, documents (publicly served). |
| `supabase/migrations` | Versioned SQL schema — roles, users, content tables, RLS policies, storage buckets, seed data. |

---

## 3. ROUTING MAP

### 3.1 Public routes

| Route | Purpose | Rendered by |
|-------|---------|-------------|
| `/` | Home | `src/app/page.tsx` |
| `/about` | About RHARK (story, vision, mission, values) | `src/app/about/page.tsx` |
| `/about/team` | Team listing | `src/app/about/team/page.tsx` |
| `/about/partners` | Partners & supporters | `src/app/about/partners/page.tsx` |
| `/programmes` | All programmes listing | `src/app/programmes/page.tsx` |
| `/programmes/srhr` | SRHR programme detail | `src/app/programmes/srhr/page.tsx` |
| `/programmes/mental-health` | Mental health detail | `src/app/programmes/mental-health/page.tsx` |
| `/programmes/hiv-teen-pregnancy` | HIV prevention detail | `src/app/programmes/hiv-teen-pregnancy/page.tsx` |
| `/programmes/gender-equality` | Gender equality detail | `src/app/programmes/gender-equality/page.tsx` |
| `/programmes/governance-policy` | Governance detail | `src/app/programmes/governance-policy/page.tsx` |
| `/programmes/climate-justice` | Climate justice detail | `src/app/programmes/climate-justice/page.tsx` |
| `/programs` | **Duplicate alias** of `/programmes` (legacy) | `src/app/programs/` |
| `/projects` | Projects listing | `src/app/projects/page.tsx` |
| `/impact` | Impact statistics | `src/app/impact/page.tsx` |
| `/resources` | Resources & downloads | `src/app/resources/page.tsx` |
| `/publications` | Publications listing | `src/app/publications/page.tsx` |
| `/news` | News & blog listing | `src/app/news/page.tsx` |
| `/events` | Events listing | `src/app/events/page.tsx` |
| `/contact` | Contact page + form | `src/app/contact/page.tsx` |
| `/contact/events` | **Duplicate copy** of `/events` (needs removal/redirect) | `src/app/contact/events/page.tsx` |
| `/get-involved` | Get involved hub | `src/app/get-involved/page.tsx` |
| `/get-involved/volunteer` | Volunteer application | `src/app/get-involved/volunteer/page.tsx` |
| `/get-involved/partner` | Partnership inquiry | `src/app/get-involved/partner/page.tsx` |
| `/get-involved/donate` | Donate (M-Pesa / bank) | `src/app/get-involved/donate/page.tsx` |
| `/get-involved/internship` | Internship application | `src/app/get-involved/internship/page.tsx` |
| `/media-centre` | Press media resources | `src/app/media-centre/page.tsx` |
| `/privacy` | Privacy Policy | `src/app/privacy/page.tsx` |
| `/terms` | Terms of Use | `src/app/terms/page.tsx` |
| `/accessibility` | Accessibility statement | `src/app/accessibility/page.tsx` |
| `/not-found` | Custom 404 | `src/app/not-found.tsx` |
| `*` (error) | Global error boundary | `src/app/error.tsx` |
| `/robots.txt` | Robots metadata | `src/app/robots.ts` |
| `/sitemap.xml` | Sitemap | `src/app/sitemap.ts` |

### 3.2 Staff Portal routes (`/admin`)

| Route | Purpose |
|-------|---------|
| `/admin` | Redirect to login/dashboard |
| `/admin/auth/login` | Staff login (Supabase email/password) |
| `/admin/dashboard` | Analytics dashboard (donations, projects, volunteer growth) |
| `/admin/news` | News list |
| `/admin/news/new` | Create article |
| `/admin/news/[id]` | Edit article |
| `/admin/events` | Events list |
| `/admin/events/new` | Create event |
| `/admin/events/[id]` | Edit event |
| `/admin/gallery` | Photo gallery management |
| `/admin/media` | Media library upload/manage |
| `/admin/partners` | Partners CRUD |
| `/admin/publications` | Publications CRUD |
| `/admin/team` | Team members list |
| `/admin/team/new` | Create member |
| `/admin/team/[id]` | Edit member |
| `/admin/projects` | Projects list |
| `/admin/projects/new` | Create project |
| `/admin/projects/[id]` | Edit project |
| `/admin/programmes` | Programmes CRUD |
| `/admin/documents` | Documents library |
| `/admin/donations` | Donations list + status |
| `/admin/volunteers` | Volunteer applications |
| `/admin/contacts` | Contact messages + reply |
| `/admin/newsletter` | Newsletter compose + subscribers |
| `/admin/subscribers` | Subscriber list |
| `/admin/emails` | Email history |
| `/admin/settings` | Organization settings |

### 3.3 API routes

| Endpoint | Purpose |
|----------|---------|
| `POST /api/contact` | Create contact message |
| `POST /api/volunteer` | Submit volunteer application |
| `POST /api/partner` | Submit partnership inquiry |
| `POST /api/internship` | Submit internship application |
| `POST /api/newsletter` | Subscribe to newsletter |
| `POST /api/donate` | Bank/direct donation flow |
| `POST /api/mpesa/stkpush` | Initiate M-Pesa STK Push |
| `GET /api/mpesa/query` | Query M-Pesa status |
| `POST /api/mpesa/callback` | M-Pesa Daraja callback |
| `GET /api/mpesa/token` | M-Pesa auth token |
| `GET /api/donate/callback` | Donation callback |
| `GET /api/donate/status` | Donation status |
| `/api/admin/*` | Admin API (auth, contacts, dashboard, donations, emails, newsletter, subscribers) |

---

## 4. COMPONENT HIERARCHY

### 4.1 Public site

```
RootLayout
├── JsonLd (Organisation schema — NOTE: client-injected via JS)
├── Providers (ThemeProvider)
├── SkipToContent
├── Header
│   ├── AnnouncementBar
│   ├── MegaDropdown (desktop nav, keyboard accessible)
│   └── MobileNavItem (mobile accordion)
├── main#main-content
│   ├── Home:
│   │   ├── HeroSection
│   │   │   ├── HeroSlideshow (Ken-Burns animated images)
│   │   │   ├── VideoModal (focus-trapped)
│   │   │   ├── FloatingInfoCard ×4
│   │   │   └── HeroButtons (3 CTAs)
│   │   ├── StatsSection / impact
│   │   ├── ProgrammesSection (fetches CMS)
│   │   ├── ProjectsSection (fetches CMS)
│   │   ├── PartnersSection (fetches CMS)
│   │   ├── NewsSection
│   │   └── NewsletterSection (client form → /api/newsletter)
│   ├── Page-level sections (About, Programmes, Events, News…)
│   └── Forms (Contact, Volunteer, Donate, Partner, Internship)
├── Footer
│   ├── Donation CTA strip
│   ├── Brand + social
│   ├── Programmes / Quick links / Contact columns
│   └── Legal bar
├── ScrollToTop
└── CookieConsent (Kenya Data Protection Act)
```

### 4.2 Staff portal

```
AdminLayout (client, auth-guarded)
├── Sidebar (role-filtered nav sections: Overview / Content / Management / Tools)
├── Top bar (mobile hamburger, user menu)
└── main → each admin page
```

### 4.3 Design system (`src/components/system/ui`)

- `Button` — variants (primary/secondary/accent/ghost/destructive/link), sizes, `isLoading` spinner, `aria-busy`.
- `Input`, `Textarea`, `Select` — labelled, `aria-invalid`, `aria-describedby`, error/hint text.
- `Alert` — info/success/warning/error variants, dismissible.
- `Modal` — focus trap, Escape close, scroll lock, backdrop.
- `Skeleton` / `SkeletonCard` — loading placeholders.
- `Accordion`, `Breadcrumbs`, `Pagination`, `Tabs`, `StatisticsCounter`.

**Connection model:** All public sections are server-rendered by default; interactive islands (`"use client"`) are used for nav, forms, and animation. Homepage sections (Programmes, Projects, Partners, News) fetch data client-side from services with loading skeletons and silent-error fallbacks.

---

## 5. DATABASE

### 5.1 Supabase (PostgreSQL) — Tables

| Table | Purpose | Key columns |
|-------|---------|-------------|
| `roles` | System roles | id, name, slug (unique), description, is_system |
| `permissions` | Role→resource→action matrix | role_id FK, resource, action |
| `users` | Staff profiles (extends `auth.users` via trigger) | id PK (FK auth.users), email, name, avatar_url, role_id, is_active |
| `news_categories` | News taxonomy | name, slug, description |
| `news` | Articles | title, slug (unique), category, content, excerpt, featured_image, gallery_images[], tags[], author_id, status (draft/published/archived), publish_date, seo_title, seo_description |
| `albums` | Photo albums | title, slug, description, cover_image |
| `gallery` | Photos | album_id FK, image_url, caption, alt_text, sort_order |
| `departments` | Org departments | name, slug, description |
| `members` | Team members | photo_url, name, position, department_id FK, biography, email, phone, social links, status, display_order |
| `projects` | Community projects | name, location, county, description, objectives[], budget, funding_partner, start_date, end_date, progress_percentage, status (upcoming/active/completed/on-hold), project_images[], documents[] |
| `events` | Public events | poster_url, title, venue, event_date, event_time, description, registration_link, google_map_url, capacity |
| `document_categories` | Doc taxonomy | name, slug, description |
| `documents` | Downloads | title, description, category_id FK, file_url, file_type, file_size, version |
| `volunteers` | Volunteer applications | first_name, last_name, email, phone, county, skills, availability, motivation, status (pending/approved/rejected/archived) |
| `donations` | Donations | transaction_id (unique), donor_name, email, phone, amount, payment_method, status (pending/successful/failed/cancelled), is_recurring, mpesa_receipt_number, mpesa_checkout_request_id, merchant_request_id |
| `contact_messages` | Contact form submissions | name, email, phone, organization, subject, message, inquiry_type, status (new/read/replied/closed), admin_notes |
| `newsletter_subscribers` | Subscribers | email (unique), first_name, is_active, subscribed_at |
| `media_library` | Uploaded media | name, url, type, size, folder, alt_text |
| `settings` | Key-value JSON config | key (unique), value (JSONB) |
| `activity_logs` | Audit trail | user_id FK, action, resource, resource_id, details, ip_address |
| `homepage_content` | Homepage CMS (section/field/value JSONB) | section, field, value (JSONB), is_active, sort_order, **UNIQUE(section, field)** |

### 5.2 Relationships

- `permissions.role_id` → `roles.id` (CASCADE)
- `users.id` → `auth.users.id` (CASCADE) — auto-created by `handle_new_user()` trigger
- `users.role_id` → `roles.id`
- `news.author_id` → `users.id`
- `gallery.album_id` → `albums.id` (SET NULL)
- `members.department_id` → `departments.id`
- `documents.category_id` → `document_categories.id`
- `activity_logs.user_id` → `users.id`

### 5.3 Foreign keys & indexes

- Seeded indexes: `idx_news_status`, `idx_news_publish_date`, `idx_news_slug`, `idx_gallery_album`, `idx_members_department`, `idx_members_status`, `idx_members_display_order`, `idx_projects_status`, `idx_events_date`, `idx_documents_category`, `idx_volunteers_status`, `idx_donations_status`, `idx_donations_transaction`, `idx_contact_messages_status`, `idx_activity_logs_user`, `idx_activity_logs_created`, `idx_media_library_folder`, `idx_homepage_content_section`, `idx_homepage_content_active`.
- Importante: **No foreign key on `news.category`** (stored as VARCHAR, not referencing `news_categories`).

### 5.4 Row Level Security (RLS)

All tables have RLS enabled. Policies:

- **Anonymous (`anon`)**: can read published news, gallery, albums, active members, projects, events, documents, settings.
- **Authenticated (`authenticated`)**: can read **all** tables (news, gallery, members, projects, events, documents, volunteers, donations, contact_messages, newsletter_subscribers, media_library, settings).

> ⚠️ **Security gap:** No INSERT/UPDATE/DELETE policies exist on most tables. Only `homepage_content` and storage have write policies. Admin operations currently rely on the **service-role key** (server-side) rather than per-user RLS — which is safe if key is never exposed, but means authorization is enforced in application code, not DB.

### 5.5 Supabase Storage Buckets

| Bucket | Public | Limit | Allowed MIME |
|--------|--------|-------|--------------|
| `featured-images` | ✅ Public | 10 MB | image/jpeg, image/png, image/webp, image/gif |

Policies: authenticated users can INSERT/UPDATE/DELETE; everyone can SELECT.

### 5.6 Seed data

- 9 system roles (Super Admin → Editor)
- 5 news categories, 8 document categories, 6 departments
- 11 settings rows
- Full homepage_content (hero, stats, programmes, partners, projects, announcements, CTA, footer)

### 5.7 Homepage CMS model

`homepage_content` stores each field as a `(section, field, value_jsonb)` row, e.g. `('hero','title','{"en":"Empowering Communities."}')`. The `getHomepageContent()` service reads all rows, parses JSON, and reconstructs typed objects (`HeroContent`, `StatItem[]`, `ProgrammePreview`, `Partner[]`, `ProjectPreview[]`, `Announcement[]`, `CtaSection`, `FooterContent`).

---

## 6. AUTHENTICATION

### 6.1 Login flow

1. User submits email + password to `/admin/auth/login`.
2. `supabase.auth.signInWithPassword()`.
3. On success → `router.push("/admin/dashboard")` + `router.refresh()`.
4. `AuthProvider` listens to `onAuthStateChange`, loads the staff profile (`users` joined with `roles`), and exposes `session` (email, name, role, roleLabel, avatar).
5. `AdminLayout` redirects unauthenticated users to `/admin/auth/login`.

### 6.2 Logout flow

- `signOut()` in `AuthContext` calls `supabase.auth.signOut()` then clears session state.
- UI: sidebar "Sign Out" button or user-menu dropdown.
- After sign-out, `AdminLayout` redirects to login.

### 6.3 Session flow

- **Middleware** (`middleware.ts`) refreshes Supabase cookies on every matching request via `updateSession()`.
- **Server side**: `getServerSession()`/`requireServerSession()` use `createServerSupabaseClient()` (SSR cookie client).
- **Client side**: `AuthContext` calls `supabase.auth.getUser()` on mount and subscribes to `onAuthStateChange`.
- Sessions are stored in cookies (`@supabase/ssr`); the refresh is transparent.

### 6.4 Protected routes

`/admin/*` is protected by `AdminLayout`: it reads `session` from context, shows a spinner while loading, and redirects to `/admin/auth/login` when `session === null`. Middleware also refreshes sessions so protected pages can read cookies server-side.

### 6.5 Role checking

`src/lib/rbac.ts` defines:

- 9 `RoleSlug`s (super-administrator … editor).
- `RESOURCES` (18 module identifiers).
- `ACTIONS` (create/read/update/delete/publish/unpublish/approve/export/manage).
- `DEFAULT_PERMISSIONS` matrix per role.
- `hasPermission(role, resource, action)`, `getRolePermissions(role)`, `canAccessModule(role, resource)`.

`AdminLayout` filters nav items by `canAccessModule(user.roleSlug, item.resource)`. Note: `PERMISSION_MATRIX` (the "future" map) is defined but **unused**; `DEFAULT_PERMISSIONS` is the effective matrix. Several roles (Programs Manager, HR, M&E) have **empty** permission arrays — meaning they see no modules.

---

## 7. STAFF PORTAL

### 7.1 Dashboard (`/admin/dashboard`)

- Stats cards: total donations, monthly donations (Recharts), project status breakdown, volunteer growth chart.
- Quick actions to create news/events/projects.
- Fetches data client-side via Supabase.

### 7.2 Sidebar navigation

Grouped into 4 sections:

- **Overview**: Dashboard
- **Content**: News, Gallery, Partners, Publications, Team, Projects, Programmes, Documents
- **Management**: Donations, Volunteers, Contacts, Newsletter
- **Tools**: Media Library, Settings

The sidebar collapses on mobile into a slide-over panel with a dark backdrop, hamburger toggle in the sticky top bar.

### 7.3 Current modules

News CRUD (with Tiptap rich text & SEO fields), Events CRUD, Gallery management (drag-reorder, albums), Partners CRUD, Publications CRUD, Team CRUD, Projects CRUD, Programmes CRUD, Documents, Donations (view + status), Volunteers (view + status), Contacts (view + reply modal), Newsletter (compose + send to subscribers), Media library (upload with previews), Settings (org info/mission/socials/contact).

### 7.4 Missing modules / gaps

- No Reports module (RESOURCES.REPORTS defined but no page).
- No Users/Staff management UI (RESOURCES.USERS/ROLES defined, no page) — staff can’t be invited/role-assigned from portal.
- No activity-log viewer.
- No email template editor.
- No media alt-text enforcement.
- No trash/restore for most content types.
- No file manager UX beyond media library.

---

## 8. CMS

### 8.1 Already editable via Staff Portal

- **News** (title, slug, category, content via Tiptap, excerpt, featured image, tags, status, publish date, SEO title/description, gallery images).
- **Events** (poster, title, venue, date/time, description, registration link, map URL, capacity).
- **Gallery** (upload, caption, alt text, album assignment, sort order, featured flag).
- **Partners** (name, slug, logo, website, type, favorite/active flags, sort).
- **Publications** (title, slug, type, category, file/URL, active/archived, sort).
- **Team** (photo, name, position, department, bio, email, phone, socials, status, display order).
- **Projects** (name, location, county, description, objectives, budget, funding partner, dates, progress, status).
- **Programmes** (title, slug, short title, description, icon, color, image, beneficiaries).
- **Documents** (upload with category/type/size/version).
- **Donations / Volunteers / Contacts** (view & update status, reply to contacts).
- **Newsletter** (compose + send, subscriber list).
- **Media library** (upload with alt text).
- **Settings** (org name, mission/vision, socials, contact info).
- **Homepage content** — backed by `homepage_content` table (hero, stats, programmes, projects, partners, announcements, CTA, footer) but **no admin UI** currently writes to it (service reads it).

### 8.2 Hardcoded content (not yet CMS-editable)

- **Hero default data** in `HeroSection.tsx` (`DEFAULT_HERO`) — only replaced if DB returns rows.
- **Programme detail pages** (`/programmes/srhr` etc.) — full static copy per page; not CMS-driven.
- **Project showcase** defaults in `ProjectsSection.tsx`.
- **Events list** `EVENTS` array in `events/page.tsx` (static fallback).
- **Partners listing** categories in `about/partners/page.tsx`.
- **Impact stats** in `constants/index.ts` (`IMPACT_STATS`) + impact page.
- **Policies** — Privacy, Terms, Accessibility are static pages, not CMS.
- **Media Centre** content is static.
- **Announcement bar** "RHARK is hiring" is hardcoded in Header.
- **Footer** brand/legal content is hardcoded in `Footer.tsx` (though org details are constants/DB-backed).
- **Cookie policy** copy in `CookieConsent`.

---

## 9. STATE MANAGEMENT

### 9.1 Server Components (RSC)

- Most public pages are server components (e.g. `/events`, `/about`, `/impact`, `/privacy`, `/terms`).
- They export `metadata` and render static content — fast, SEO-friendly, no JS on the critical path.

### 9.2 Client Components

- Marked `"use client"` when they need interactivity: Header, Hero, forms, Newsletter, all home data sections, all admin pages.
- Server-rendered HTML is hydrated client-side.

### 9.3 React context

- **`AuthContext`** provides `session`, `loading`, `isAuthenticated`, `hasRole`, `hasAnyRole`, `canAccess`, `signOut` to the staff portal.
  - ⚠️ **Performance risk:** `createClient()` is called during every render of `AuthProvider` (new object identity), and the context `value` object + methods are rebuilt every render → every consumer re-renders on any provider render. The `useEffect` dependency `[supabase]` also re-fires on each render because the client identity changes. **Fix applied:** `createClient()` now caches a singleton in `src/lib/supabase/client.ts`.
- **`ThemeProvider`** (local) applies light/dark/system theme to `<html>`; no context value exposed.

### 9.4 Local state & hooks

- `useState`/`useEffect` per component (form fields, menu open/close, modal, status feeds).
- Custom hooks: `useScrollPosition` (header hide-on-scroll), `useFocusTrap` (modals/menu), `useIntersectionObserver`, `useMediaQuery`.
- Framer Motion `useInView` for scroll-triggered section reveals.

### 9.5 Data flow

- Public pages → `services/*` → Supabase (server client) or static fallback.
- Home sections (Programmes/Projects/Partners/News) fetch **client-side** on mount (`useEffect`) with skeleton loaders.
- Forms → `fetch("/api/...")` → server handlers → Supabase insert + optional email.
- Admin pages → `createClient()` (browser) direct `.from()` queries.

---

## 10. PERFORMANCE

### 10.1 Large components / files

| File | Lines | Notes |
|------|-------|-------|
| `src/lib/rbac.ts` | ~400 | Mostly a duplicated static matrix (PERMISSION_MATRIX unused) — heavy but dead-weight import surface. |
| `src/components/admin/AdminLayout.tsx` | ~332 | Contains all nav config + layout — candidate for splitting. |
| `src/components/home/HeroSection.tsx` | ~639 | Monolithic: slideshow, modal, floating cards, buttons, content — could split. |
| `src/components/layout/Header.tsx` | ~668 | Contains announcement bar, desktop dropdown, mobile accordion, full header — could split further. |
| `src/app/get-involved/donate/page.tsx` | ~590 | Donation flow with M-Pesa polling — candidate for hooks/helpers. |
| `src/app/admin/projects/new/page.tsx` | 1 giant line | Unreadable, unmaintainable — must be refactored. |
| `src/app/admin/team/new/page.tsx` | 1 giant line | Same issue. |
| `src/app/admin/projects/[id]/page.tsx` | 1 giant line | Same issue. |
| `src/app/admin/team/[id]/page.tsx` | 1 giant line | Same issue. |

### 10.2 Slow rendering / re-renders

- `AuthContext` — new Supabase client every render + unstable context value (mitigation applied).
- `useScrollPosition` in Header drives hide/show on every scroll tick — causes the whole Header to re-render; consider `requestAnimationFrame` throttling.
- Home data sections re-query on every mount (no SWR/React Query, no cache).
- `NewsletterSection` now calls `/api/newsletter` with loading/error states (previously local-only).

### 10.3 Duplicate / repeated API calls

- `getHomepageContent()` is invoked by both `cms.getHomepage()` and legacy paths — ensure it is called once per page.
- `createClient()` repeatedly created new Supabase clients (fixed with singleton).
- No request deduplication for news/events/projects across `getX()` and `getXBySlug()`; listing + detail fetch separately.
- Newsletter API calls `getSubscriberByEmail` then `createSubscriber` (two store calls).

### 10.4 Images

- All hero images loaded via `next/image` with `fill`, `sizes`, `quality` — good.
- Hero slideshow uses `priority` only on first frame, lazy elsewhere — good.
- **Issue:** Hero slideshow keeps interval running even off-screen (rotates every 3.5 s regardless of visibility) — should pause when not in view.
- Remote Unsplash images configured in `next.config.ts` `remotePatterns`, formats avif/webp — good.
- **Issue:** 16 hero JPGs are large originals (likely multi-MB camera exports) — should be sized/compressed; only first is eager.
- Admin previews use raw `<img>` (fine for admin).

### 10.5 Animations / Framer Motion

- `HeroSlideshow` Ken-Burns effect uses `motion.div` with infinite repeat — GPU-friendly transform/opacity but heavy if many frames.
- Multiple sections use `whileInView`/`useInView` reveals; `framer-motion` is bundled app-wide (no lazy import) — consider `motion/react` lazy for below-fold sections.
- `AnimatePresence` used in nav/mobile hero — correct usage.
- `prefers-reduced-motion` global CSS override disables animations — good.

### 10.6 Caching

- No `next: { revalidate }` / `export const revalidate` on any page.
- No ISR for news/events/projects — all content fetched at request time (server) or mount (client).
- API handlers don't set `Cache-Control` (except Next defaults).
- No React Query/SWR cache layer.

### 10.7 Lazy loading

- `next/image` lazy loads below-fold images by default — good.
- No `next/dynamic` used anywhere → no route-level code-splitting beyond RSC boundaries.
- Tiptap editor imported eagerly in admin news pages (could be dynamic-imported).
- Recharts is a large dependency loaded on dashboard — could be lazy.

---

## 11. SECURITY

### 11.1 Authentication

- Supabase Auth (GoTrue) with cookie sessions (`@supabase/ssr`).
- Middleware refreshes session on every request and blocks unauthenticated access to `/admin`.
- Password auth only. No MFA, no OAuth (Google/GitHub) configured here.

### 11.2 Authorization

- Client-side RBAC filters nav in `AdminLayout`.
- API/admin routes use `requireServerSession()`/`createServerSupabaseClient()` for server-side checks.
- **Gap:** The application-level role checks are enforced in UI (nav visibility) + some server routes. The DB has no INSERT/UPDATE/DELETE policies for most tables → writes rely on service-role key. A leaked anon key cannot write, but the lack of granular per-user write policy means all authenticated users could write via API if a route skips its role check.
- Several roles (Programs Manager, HR, M&E) have no permissions defined → they cannot see any admin modules (misconfiguration).

### 11.3 Environment variables

Required:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL` (optional — falls back to `https://www.rhark.org`)
- `MPESA_CONSUMER_KEY`, `MPESA_CONSUMER_SECRET`, M-Pesa passkey/shortcode (in `src/lib/mpesa/`)
- Email SMTP credentials (in `src/lib/email.ts`)
- `SUPABASE_SERVICE_ROLE_KEY` (server-only)

`.env.local.example` exists. **Never** expose service-role key to the browser.

### 11.4 Supabase usage

- Browser: `createBrowserClient` (anon key) — safe.
- Server: `createServerSupabaseClient` + `getServerSession`/`requireServerSession`.
- RLS enabled on all tables with anon read policies for public content.
- Storage bucket `featured-images` public with size/MIME restrictions.

### 11.5 Validation

- All public forms use **Zod** schemas (`src/lib/validations.ts`) + `react-hook-form` + `zodResolver`.
- API routes re-validate with `schema.safeParse()`.
- Honeypot `_honeypot` field on contact/volunteer/partner/internship/donate forms (spam protection).
- **Gaps:** Admin pages (news/events/projects/team/etc.) use manual `useState` validation (`!form.name && …`) — no Zod. Several admin forms have no validation at all.
- No rate limiting on public APIs (middleware notes placeholders only).

### 11.6 File uploads

- Admin media/news/events/gallery upload via Supabase Storage (`featured-images`).
- 10 MB limit, image MIME whitelist enforced at bucket level.
- Client-side previews; server verifies upload path.

---

## 12. UI/UX

### 12.1 Consistency

- Design tokens centralized in `tailwind.config.ts` (primary teal #0d6e6e, accent amber #f59e0b, secondary coral #e8705a; neutral slate scale).
- Reusable `system/ui` primitives (Button, Input, Textarea, Select, Alert, Modal, Skeleton) used across public forms and admin.
- Card styles consistent (rounded-[1.6rem], border-white/75, shadow, hover elevation).
- Hero/page headers use consistent gradient bands (`bg-gradient-to-br from-primary-600 to-primary-800`).
- **Inconsistencies:** Donate form uses shared primitives + inline styles; internship form hand-rolls inputs; Contact/Volunteer/Partner each re-implement their own `Field` helper. Homepage sections all share the fade-up pattern but with slightly different paddings.
- Admin pages are a mix: some use the shared Input/Button, many hand-roll raw inputs (team/projects pages are single-line JSX — poor readability and inconsistent styling).

### 12.2 Spacing

- `container-site` (max-w-7xl + px-4/sm:6/lg:8) used consistently.
- Section rhythm: `py-12 lg:py-16` on home, `py-16 lg:py-20` on pages — consistent-ish.
- Grid gaps: `gap-5` (cards), `gap-4` (forms), `gap-10/14` (page sections).
- Slight drift between `section-padding` utility and inline classes.

### 12.3 Typography

- Display font: Montserrat (via `--font-montserrat`), body: system sans (`--font-inter`).
- Tailwind `fontFamily` maps `sans`, `display`.
- Fluid type scale (`text-fluid-*`) + `text-balance` for headings.
- Headings `font-display font-bold tracking-tight` globally.

### 12.4 Colors

- Semantic palette (primary/accent/secondary/success/warning/error/info + neutral scale).
- Dark mode defined in CSS custom properties but app defaults to light; `ThemeProvider` supports system preference.
- Contrast is generally strong (teal on white, white on teal).

### 12.5 Accessibility

- `SkipToContent` link first in DOM (WCAG 2.4.1).
- `lang="en"` on `<html>`.
- Focus-visible styles globally + per-component ring utilities.
- `aria-label` on nav, forms, modals, icons.
- Focus trap on mobile menu, video modal, admin sidebar, and shared Modal.
- Forms use `aria-invalid`, `aria-describedby`, `role="alert"` (mostly).
- `prefers-reduced-motion` respected globally.
- **Gaps:** Internship form labels lack `htmlFor`/`id` association; Staff login error lacks `role="alert"`; Donate amount preset buttons lack `aria-pressed`; some admin inputs lack labels; heading hierarchy in admin is inconsistent; duplicate `id` risk with shared icons repeated on a page.

### 12.6 Responsiveness

- Mobile nav (accordion + slide-over), mobile hero (image strip hides visual), responsive grids (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`), footer stacks on mobile.
- Admin sidebar converts to off-canvas with backdrop on mobile.
- Header hides on scroll-down, shows on scroll-up; announcement bar adapts.
- **Gaps:** Hero CTAs and trust badges can overflow on very small screens; announcement text can overlap iOS notch; floating cards positioned with negative offsets can clip.

---

## 13. REFACTORING OPPORTUNITIES

### 13.1 Large files to split

| File | Why |
|------|-----|
| `Header.tsx` (668) | Split announcement bar, desktop dropdown, mobile menu into separate files. |
| `HeroSection.tsx` (639) | Split slideshow, modal, floating card, buttons. |
| `DonatePage` (590) | Extract M-Pesa polling hook, status views. |
| `AdminLayout.tsx` (332) | Split sidebar, topbar, user menu. |
| `rbac.ts` (400) | Remove unused `PERMISSION_MATRIX` (dead code) — keep only effective matrix. |
| Admin single-line pages (projects/team new & edit) | Rewrite as normal JSX. |

### 13.2 Duplicate components / logic

- `Field`/`VField`/inline field wrappers across Contact, Volunteer, Partner, Internship forms → replace with shared `FormField` from `system/ui`.
- `ic()` / `inputClass()` duplicated per form → use shared `Input`.
- `fadeUp` animation variants duplicated across ~8 home sections → shared constants module.
- Duplicate hero/page header section markup across all pages → extract `<PageHero>` component.
- `cn()` used consistently (good), but several admin pages hand-build class strings.
- `statCard`/CTA markup repeated across home sections after `ProgrammesSection`, `ProjectsSection`, `PartnersSection`, `NewsSection` — could share a `SectionHeader`.

### 13.3 Should be split

- `services/cms/index.ts` re-exports everything (fine) but mixes static-fallback and Supabase-backed modules with the same names (`getNewsArticles` defined locally AND imported from `services/news`) — **name collision risk**; local definitions shadow imports for news/events/publications. Must be reconciled.

---

## 14. MISSING FEATURES (Production readiness)

1. **Staff/user management UI** — invite staff, assign roles, deactivate accounts.
2. **Role/permission editor** — administer roles & permissions from the portal.
3. **MFA / 2FA** on staff login.
4. **Password reset** flow (Supabase supports; UI missing).
5. **Reports & exports** — CSV/PDF export for donations, volunteers, contacts, subscribers.
6. **Activity audit log viewer** in portal.
7. **Homepage CMS editor** — write UI for `homepage_content`.
8. **Programme detail CMS** — make `/programmes/*` detail pages data-driven.
9. **ISR / revalidation** for news, events, projects (stale-while-revalidate).
10. **Request-level caching** (React Cache/SWR/React Query).
11. **File uploads for projects/partners/documents** (only featured images/media-library documented).
12. **M-Pesa account balance / reversal** handling.
13. **Donation receipts** auto-email.
14. **Newsletter unsubscribe link** & double opt-in.
15. **Search** across news/events/resources.
16. **RSS feed** for news.
17. **Multi-language** (note: homepage_content JSON stores `{en: …}` placeholders, but no i18n framework).
18. **Rate limiting** on public APIs.
19. **CI/CD pipeline**, lint/typecheck/test gates.
20. **E2E tests** (Playwright) for forms + admin CRUD.
21. **Error monitoring** (Sentry) + uptime checks.
22. **Dynamic OG image generation** for news/articles.
23. **`/contact/events` removal/redirect** + `/programs` alias canonical.
24. **Redirects strategy** (www/non-www, trailing slash).

---

## 15. TECHNICAL DEBT (ranked by severity)

| # | Severity | Item |
|---|----------|------|
| 1 | 🔴 Critical | `PERMISSION_MATRIX` present but unused; several roles (Programs Manager, HR, M&E) have empty `DEFAULT_PERMISSIONS` → staff can’t access modules. RBAC inconsistent. |
| 2 | 🔴 Critical | Admin new/edit pages for projects & team are single-line unmaintainable JSX (no readability, minimal validation, inconsistent a11y). |
| 3 | 🔴 Critical | `JsonLd` injects structured data client-side only → crawlers without JS don’t see it. |
| 4 | 🔴 Critical | Duplicate page `/contact/events` (copy of `/events`) causes SEO duplicate-content + wrong canonical. |
| 5 | 🟠 High | `services/cms/index.ts` locally shadows `getNewsArticles`/`getEvents`/`getPublications` imports → possible stale fallback data used instead of Supabase. |
| 6 | 🟠 High | Public pages have **no ISR/cache** — every request hits Supabase; CMS data refetched per mount. |
| 7 | 🟠 High | `AuthContext` re-created Supabase client per render (mitigated) — context value still unstable, could memoize. |
| 8 | 🟠 High | No server-side INSERT/UPDATE/DELETE RLS policies → write authorization is app-only. |
| 9 | 🟠 High | Missing metadata/canonicals on Contact, Volunteer, Donate, and all `/admin` (no noindex). |
| 10 | 🟡 Medium | Contact, Volunteer, Donate, Partner, Internship pages lack shared design-system field component (duplicated field code). |
| 11 | 🟡 Medium | Internship form missing `htmlFor`/`id`; staff login error missing `role="alert"`; donate amount buttons missing `aria-pressed`. |
| 12 | 🟡 Medium | Hero slideshow interval runs off-screen & images oversized. |
| 13 | 🟡 Medium | `framer-motion`, `recharts`, `@tiptap/*` not code-split/lazy-loaded. |
| 14 | 🟡 Medium | `news.category` is VARCHAR, no FK to `news_categories`. |
| 15 | 🟢 Low | `Prisma` dependency installed but unused. |
| 16 | 🟢 Low | `ARCHITECTURE.md` & `RHARK_WEBSITE_DOCUMENTATION_REPORT.md` now partially superseded by this document. |
| 17 | 🟢 Low | Inline Tailwind arbitrary values (e.g. `z-[250]`, `top-[34px]`) instead of token utilities. |
| 18 | 🟢 Low | Unused imports/`useParams` in some admin pages; `loadSession` re-triggered multiple times. |

---

## 16. PRODUCTION READINESS SCORE

| Category | Score / 10 | Notes |
|----------|-----------|-------|
| **Architecture** | 7.0 | Clean Next.js App Router + service layer + Supabase; but service ambiguity (static vs DB) and monolithic files drag it down. |
| **Security** | 6.0 | Auth + RLS + headers + validation are strong; RBAC gaps, no rate limiting, app-only write auth, and no per-user write policies weaken it. |
| **Performance** | 5.5 | No caching/ISR, no code splitting, repeated Supabase client creation (fixed), large unsized hero images, eager Recharts. |
| **Accessibility** | 7.0 | Skip-link, focus traps, ARIA, reduced-motion — good baseline; form-label gaps and admin a11y inconsistencies remain. |
| **SEO** | 6.0 | Good metadata factory + sitemap + robots; but client-only JSON-LD, missing metadata on key pages, duplicate `/contact/events`, no dynamic `generateMetadata`. |
| **Scalability** | 6.5 | Supabase scales; homepage CMS JSONB model is flexible; but no caching and repeated N+1-style fetches currently limit load. |
| **Maintainability** | 5.5 | Unreadable single-line admin pages, duplicated form field code, shadowed service functions, dead RBAC matrix. |
| **Overall** | **6.2 / 10** | Solid MVP with a strong design system and data model, held back by RBAC inconsistencies, caching, SEO structured-data, and admin-page maintainability. |

---

## 17. FINAL RECOMMENDATIONS — RHARK v3.0 ROADMAP

### Phase 1 — Stabilize & Secure (Weeks 1–2) 🎯 Highest priority

1. **Fix RBAC**: populate `DEFAULT_PERMISSIONS` for Programs Manager, HR, M&E; wire `PERMISSION_MATRIX` to DB or remove it.
2. **Add DB write policies** per role/resource (or ensure every admin mutation runs through the service-role server-side with explicit role checks).
3. **Rewrite admin new/edit pages** for Projects & Team into readable, validated forms using shared UI primitives.
4. **Remove `/contact/events`** duplicate (redirect to `/events`); add `/programs` → `/programmes` redirect.
5. **Server-render JSON-LD** (convert `JsonLd` from client to server component).

### Phase 2 — SEO & Performance (Weeks 3–4)

6. Add `generateMetadata` to dynamic routes (news/events/projects) for titles/OG/Twitter/canonical.
7. Add `noIndex` to `/admin/*`; extend `robots.ts` to disallow `/admin`, `/api`.
8. Add metadata + canonical to Contact, Volunteer, Donate pages.
9. Enable **ISR** (`revalidate = 60–300`) on public pages; add `Cache-Control` to APIs.
10. Add **SWR/React Query** cache layer for client-side home sections.
11. Lazy-load `recharts`, `@tiptap/*`, below-fold `framer-motion` sections (`next/dynamic`).
12. Compress/resize hero images (serve WebP/AVIF at 800–1200 px); pause slideshow when off-screen.

### Phase 3 — Feature completeness (Weeks 5–8)

13. Staff/user management UI with role assignment.
14. Reports module (exports for donations/volunteers/contacts/subscribers).
15. Homepage CMS editor (write UI for `homepage_content`).
16. Programme detail pages data-driven.
17. MFA + password-reset UI + activity-log viewer.
18. Newsletter double opt-in + unsubscribe.
19. Search (news/events/resources) and RSS feed.

### Phase 4 — Engineering excellence (Weeks 9–12)

20. CI/CD (lint, typecheck, build, tests) + Playwright E2E suite.
21. Sentry error monitoring + uptime checks.
22. Rate limiting on public APIs (Upstash Redis).
23. Standardize form fields onto shared design-system components (kill duplicated Field helpers).
24. Consolidate `services/cms` name collisions; delete dead code (`PERMISSION_MATRIX`, unused Prisma).
25. Extract `PageHero`, `SectionHeader`, shared animation variants.
26. Accessibility audit pass: fix internship labels, login alert, donate `aria-pressed`, admin heading hierarchy.
27. Comprehensive documentation refresh (this report, updated ARCHITECTURE.md).

---

*End of RHARK Platform Architecture Report.*