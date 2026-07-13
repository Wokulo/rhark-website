# RHARK Design System and Component Library

This folder contains the reusable UI foundation for the RHARK website. It is intended to be used by all future pages and feature modules.

## Folder Structure

```text
src/components/system/
  layout.tsx        Container, Section, Grid, Stack, PageHeader
  typography.tsx    Heading, SubHeading, Paragraph, Caption, Blockquote
  buttons.tsx       Button, ButtonLink, IconButton, button variants
  cards.tsx         Program, Project, News, Publication, Testimonial, Team, Partner, Statistic cards
  forms.tsx         Input, Textarea, Select, Checkbox, Radio, FileUpload, SubmitButton, ValidationMessage
  navigation.tsx    Navbar, MobileMenu, MegaMenu, Breadcrumbs, Pagination
  feedback.tsx      Alert, Toast, Modal, Drawer, SkeletonLoader, Spinner
  data-display.tsx  Accordion, Tabs, Timeline, StatisticsCounter, Badge, Tag
  media.tsx         ImageCard, GalleryGrid, VideoCard
  utility.tsx       ScrollToTopButton, SystemThemeProvider, CookieBanner, LoadingScreen
  EXAMPLES.tsx      Documentation-only examples
  index.ts          Public exports
```

## Usage

Import from the system barrel:

```tsx
import { Button, Container, Heading, ProgramCard, Section } from "@/components/system";

export function ExampleSection() {
  return (
    <Section tone="muted">
      <Container>
        <Heading level={2}>Programs</Heading>
        <ProgramCard
          title="SRHR"
          description="Sexual and reproductive health and rights."
          href="/programmes/srhr"
        />
        <Button>Learn more</Button>
      </Container>
    </Section>
  );
}
```

## Design Tokens

The system uses the RHARK Tailwind configuration:

- Primary: teal for identity, trust, health, and navigation.
- Accent: amber for high-priority calls to action.
- Secondary: coral for warmth and people-centered emphasis.
- Neutral: slate-based surfaces and text.
- Typography: Montserrat for headings, Inter for body text.
- Shape: rounded components use consistent RHARK radius values.
- Motion: short transitions and Framer Motion for overlays and menus.

## Accessibility Standards

All components should target WCAG 2.2 AA:

- Interactive controls include visible focus states.
- Icon-only buttons require accessible labels.
- Forms connect labels, error text, and invalid state with ARIA.
- Navigation components include semantic landmarks and menu/dialog roles.
- Motion should remain subtle and respect reduced-motion global CSS.
- Color must not be the only means of communicating state.

## Dark Mode Readiness

Components include `dark:` classes and use neutral surface tokens. Dark mode does not need to be exposed in the UI yet, but the component styles are prepared for a future class-based theme toggle.

## Component Rules

- Keep components reusable and content-agnostic.
- Prefer props and typed data over hard-coded RHARK content.
- Use Lucide React for icons.
- Use `next/image` for images and `next/link` for internal links.
- Use `cn()` for class merging.
- Add documentation comments and examples for new components.
- Do not create page-specific layout inside this folder.
