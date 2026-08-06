# Routing Repair — TODO Tracker

Objective: Remove every 404 in the RHARK website. No redesign.

## Steps

- [x] 1. Audit all navigation links (public nav, footer, mobile nav, staff portal, homepage sections)
- [x] 2. Identify broken routes producing 404s
- [x] 3. Repoint broken project links in `ProjectsSection.tsx` to `/projects`
- [x] 4. Repoint generated project hrefs in homepage `page.tsx` to `/projects`
- [x] 5. Add slug fallback in `ProgrammesSection.tsx` → `/programmes` for slugs without pages
- [x] 6. Remove `/admin/search` and `/admin/reports` nav items in `AdminLayout.tsx`
- [x] 7. Verify all remaining links resolve to existing routes
