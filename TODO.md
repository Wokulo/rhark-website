# RHARK Website Tasks

## Partners Section — Add Siaya County Government Logo (Home)
- [x] Add Siaya County Government as first partner in `src/components/home/PartnersSection.tsx`
- [x] Keep WHO and JOOUST partner cards unchanged
- [x] Reference `/images/partners/siaya-county-government-logo.png` (asset to be added later)
- [x] Verify no new TypeScript errors from the Partners component

---

## Programs Section — Add 4 New Programs (Home)
- [x] Extend `ProgrammeSlug` union in `src/types/index.ts` with new slugs
- [x] Fix pre-existing `Program` → `Programme` type import in `src/data/programmes.ts`
- [x] Add 4 new program entries (Deep Canvassing, In-School CSE, Community Safe Spaces, Gumzo Chuoni) to `src/data/programmes.ts`
- [x] Add new icons + image mappings to `src/components/home/ProgrammesSection.tsx`
- [x] Verify no new TypeScript errors from modified Programs files

---

# RHARK CMS Implementation Todo

## Phase 1: Foundation ✅
- [x] Install dependencies (supabase, tanstack-table, tiptap, recharts, etc.)
- [x] Create Supabase client (server + browser)
- [x] Create database types/schema
- [x] Rewrite auth with Supabase
- [x] Create RBAC utilities
- [x] Update middleware for Supabase auth
- [x] Create database migration SQL
- [x] Create admin utility functions

## Phase 2: Admin Infrastructure ✅
- [x] Create reusable admin components (StatsCard, AdminLayout, RichTextEditor)
- [x] Build full admin layout with sidebar navigation
- [x] Build admin login page
- [x] Build admin dashboard with charts (recharts)
- [x] RBAC-based navigation filtering

## Phase 3: CMS Modules ✅
- [x] News Management (CRUD + rich text editor)
- [x] Team Members CRUD
- [x] Project Management CRUD
- [x] Event Management CRUD
- [x] Settings (organization info, social links)
- [ ] Photo Gallery (drag & drop, albums)
- [ ] Document Management System
- [ ] Donation Management (M-Pesa dashboard)
- [ ] Volunteer Management
- [ ] Contact Messages Inbox
- [ ] Newsletter Subscribers
- [ ] Media Library
- [ ] Global Search
- [ ] Reports (PDF/Excel/CSV)

## Phase 4: Public Website CMS Integration
- [ ] Home page (dynamic hero, stats, featured content)
- [ ] About page
- [ ] Programs/Programmes
- [ ] Projects (dynamic)
- [ ] News/Blog (dynamic)
- [ ] Gallery
- [ ] Events
- [ ] Team
- [ ] Documents/Publications
- [ ] Donate
- [ ] Volunteer
- [ ] Contact

## Phase 5: Polish & Security
- [ ] Activity/Audit logs
- [ ] CSRF protection
- [ ] Rate limiting
- [ ] File upload security
- [ ] Error boundaries
- [ ] Loading skeletons
- [ ] Accessibility checks
- [ ] SEO metadata

