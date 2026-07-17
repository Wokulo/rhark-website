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