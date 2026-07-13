# RHARK Website Documentation Report

## 1. Project Overview

**Project name:** RHARK Website  
**Organization:** Reproductive Health Action and Rights Kenya (RHARK)  
**Organization type:** Community-Based Organization (CBO)  
**Location:** Siaya County, Kenya  
**Prepared date:** July 8, 2026  

The RHARK website is a modern web platform designed to communicate the mission, programmes, projects, impact, news, events, publications, and contact information of Reproductive Health Action and Rights Kenya. The website supports RHARK's work in Sexual and Reproductive Health and Rights (SRHR), mental health, HIV and teen pregnancy prevention, gender equality, governance and policy engagement, climate justice, and youth empowerment.

The website is built with Next.js, React, TypeScript, and Tailwind CSS. It uses a component-based architecture that makes the system maintainable, reusable, responsive, accessible, and ready for future integrations such as a CMS, newsletter provider, email service, analytics, and M-Pesa donation payments.

## 2. Project Objectives

The main objectives of the RHARK website are:

1. Present RHARK's identity, mission, vision, values, and community impact.
2. Provide clear information about RHARK's programmes and projects.
3. Improve communication with stakeholders, partners, donors, volunteers, interns, and community members.
4. Offer accessible contact, newsletter, volunteer, internship, and donation pathways.
5. Create a scalable digital platform that can later connect to a headless CMS and external services.
6. Improve RHARK's online visibility through metadata, structured content, and search-engine-friendly pages.

## 3. Technology Stack

| Area | Technology |
|---|---|
| Framework | Next.js App Router |
| UI library | React |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Icons | Lucide React |
| Forms | React Hook Form |
| Validation | Zod |
| Theme support | next-themes |
| Formatting | Prettier with Tailwind plugin |
| Build tool | Next.js |
| Package manager | npm |

## 4. Application Architecture

The website follows the Next.js App Router structure. Pages are stored inside `src/app`, reusable UI and layout elements are stored in `src/components`, shared data is stored in `src/data`, and business logic is separated into `src/lib`, `src/services`, `src/hooks`, `src/utils`, and `src/types`.

The architecture separates presentation, content, validation, services, and configuration. This makes it easier to add new pages, update content, change integrations, or replace static content with CMS-powered content in the future.

### Main Folder Structure

```text
src/
  app/                 Website pages and API routes
  components/          Reusable UI, layout, and homepage components
  constants/           Site name, organization details, navigation, routes, stats
  data/                Static programmes, projects, and team content
  hooks/               Custom React hooks
  lib/                 Metadata and validation helpers
  providers/           App-level providers such as theme support
  services/            CMS and donation integration layers
  types/               TypeScript interfaces and shared types
  utils/               Utility functions
```

## 5. Website Pages

The website includes the following routes:

| Page | Route | Purpose |
|---|---|---|
| Home | `/` | Main landing page with hero, impact, programmes, projects, stories, news, partners, and newsletter sections |
| About | `/about` | RHARK story, vision, mission, values, and organizational background |
| Team | `/about/team` | Team member information |
| Partners | `/about/partners` | Partner and collaborator information |
| Programmes | `/programmes` | Overview of RHARK programme areas |
| SRHR | `/programmes/srhr` | Sexual and Reproductive Health and Rights programme |
| Mental Health | `/programmes/mental-health` | Mental health and wellness programme |
| HIV and Teen Pregnancy | `/programmes/hiv-teen-pregnancy` | HIV/AIDS and teen pregnancy prevention programme |
| Gender Equality | `/programmes/gender-equality` | Gender equality and empowerment programme |
| Governance and Policy | `/programmes/governance-policy` | Advocacy, accountability, and policy engagement programme |
| Climate Justice | `/programmes/climate-justice` | Climate justice and community resilience programme |
| Projects | `/projects` | Active and planned project information |
| News | `/news` | News, updates, and stories |
| Events | `/events` | Upcoming and past events |
| Publications | `/publications` | Reports, research, briefs, and publications |
| Volunteer | `/get-involved/volunteer` | Volunteer participation pathway |
| Internship | `/get-involved/internship` | Internship opportunity pathway |
| Donate | `/get-involved/donate` | Donation support pathway |
| Contact | `/contact` | Contact information and contact form |
| Privacy | `/privacy` | Privacy policy |
| Terms | `/terms` | Terms of use |
| Accessibility | `/accessibility` | Accessibility statement |

## 6. Main Website Features

### 6.1 Homepage

The homepage introduces RHARK and contains key sections:

- Hero section for first impression and call to action.
- Impact statistics showing youth reached, active projects, counties covered, and partners.
- About preview section.
- Programme overview section.
- Projects preview section.
- Stories and news sections.
- Get involved section for volunteering, internships, and donations.
- Newsletter subscription section.
- Partners section.

### 6.2 Navigation

Navigation is defined centrally in `src/constants/index.ts`. The navigation structure includes Home, About, Programmes, Projects, Media, Get Involved, and Contact. Dropdown navigation is supported for grouped pages such as About, Programmes, Media, and Get Involved.

### 6.3 Programmes

Programme information is stored in `src/data/programmes.ts`. The current programme areas are:

- Sexual and Reproductive Health and Rights
- Mental Health and Wellness
- HIV/AIDS and Teen Pregnancy Prevention
- Gender Equality and Empowerment
- Governance and Policy Engagement
- Climate Justice

Each programme includes an ID, slug, title, short title, description, icon, color, image details, objectives, and target beneficiaries.

### 6.4 Projects

Project data is stored in `src/data/projects.ts`. The current sample projects include:

- Ujana Salama
- Mama na Mtoto

Each project includes a slug, title, summary, description, programme link, status, start date, location, beneficiary count, image, partners, and tags.

### 6.5 Contact Form

The contact form submits to:

```text
POST /api/contact
```

The API route validates submitted data using Zod. It checks name, email, phone, subject, message, and a hidden honeypot field for basic spam protection. In development mode, submissions are logged to the console. The email sending integration is prepared but not yet connected to an SMTP or transactional email provider.

### 6.6 Newsletter Form

The newsletter form submits to:

```text
POST /api/newsletter
```

The API route validates the submitted email address and optional first name. It is currently prepared for a future newsletter service such as Mailchimp, ConvertKit, or a custom mailing list.

### 6.7 Donation Service

The donation service exists in:

```text
src/services/donation/index.ts
```

It defines the shape of donation payloads and results. The M-Pesa Daraja integration is currently a stub, meaning the interface is prepared but live payments are not yet active. Future work will include OAuth token generation, STK Push initiation, transaction storage, callback handling, and payment confirmation.

### 6.8 CMS Service

The CMS abstraction layer exists in:

```text
src/services/cms/index.ts
```

The website currently uses static data from `src/data`, but all content access is prepared through service functions such as `getProgrammes`, `getProjects`, and `getTeamMembers`. This allows RHARK to later migrate to a CMS such as Sanity or Contentful with minimal changes to the front-end components.

## 7. Design and User Interface

The interface uses Tailwind CSS for responsive styling and reusable utility classes. UI primitives such as buttons, cards, form fields, and feedback components are grouped under `src/components/ui`.

The visual design is intended to be:

- Clean and professional.
- Accessible to a wide audience.
- Suitable for a nonprofit and community health organization.
- Responsive across desktop, tablet, and mobile screens.
- Easy to scan for visitors seeking services, information, or partnership opportunities.

### Design System Direction

The design system should be treated as one of the highest-priority launch items. The current implementation now supports:

- A RHARK-aligned teal, amber, coral, semantic, and neutral color palette.
- Montserrat for display/headings and Inter for body text.
- Centralized spacing, radius, shadow, z-index, animation, and container tokens in Tailwind.
- Reusable button, card, badge, section, input, textarea, and select components.
- Light neutral surfaces and dark-mode-ready surface tokens.
- Lucide React as the preferred iconography system.

Recommended design rules:

- Use primary teal for trust, navigation, health, and identity.
- Use amber for high-priority calls to action such as Donate.
- Use coral sparingly for human warmth and secondary emphasis.
- Keep cards to content groupings, not whole-page layout wrappers.
- Use consistent section padding through `.section-padding` and `.container-site`.
- Keep motion subtle, short, and disabled for users who prefer reduced motion.

## 8. Accessibility

Accessibility is considered in the layout and component structure. The root layout includes:

- Skip-to-content support.
- Semantic page structure.
- Focusable main content.
- Accessible header and footer structure.
- Cookie consent component.
- Scroll-to-top control.

The project also includes an accessibility statement page at:

```text
/accessibility
```

Recommended accessibility targets include WCAG 2.2 AA, visible focus states, meaningful alt text, labeled form inputs, keyboard navigation, sufficient color contrast, and mobile-friendly touch targets.

## 9. SEO and Metadata

SEO metadata is managed through:

```text
src/lib/metadata.ts
```

Pages use a shared `buildMetadata` helper to generate consistent metadata. The root layout also includes organization JSON-LD structured data to improve search engine understanding of RHARK as an organization.

The site URL is controlled by:

```text
NEXT_PUBLIC_SITE_URL
```

This should be set correctly in production so canonical URLs and social media previews point to the live website.

## 10. Environment Configuration

The environment template is stored in:

```text
.env.local.example
```

Important environment variables include:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Base URL for metadata and canonical links |
| `SMTP_HOST` | Email server host for contact form |
| `SMTP_PORT` | Email server port |
| `SMTP_USER` | Email username |
| `SMTP_PASS` | Email password |
| `CONTACT_EMAIL` | Destination email for contact messages |
| `NEWSLETTER_API_KEY` | Future newsletter provider API key |
| `NEWSLETTER_LIST_ID` | Future newsletter list ID |
| `CMS_API_URL` | Future CMS endpoint |
| `CMS_API_TOKEN` | Future CMS access token |
| `MPESA_CONSUMER_KEY` | Future M-Pesa API key |
| `MPESA_CONSUMER_SECRET` | Future M-Pesa API secret |
| `MPESA_SHORTCODE` | M-Pesa shortcode |
| `MPESA_PASSKEY` | M-Pesa passkey |
| `MPESA_CALLBACK_URL` | M-Pesa callback endpoint |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Future Google Analytics measurement ID |

Sensitive values should only be stored in `.env.local` or the deployment platform's secret manager. They should not be committed to source control.

## 11. Installation and Setup

### Requirements

- Node.js
- npm
- Git

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

The development server normally runs at:

```text
http://localhost:3000
```

### Build for Production

```bash
npm run build
```

### Start Production Build

```bash
npm run start
```

### Format Code

```bash
npm run format
```

## 12. Maintenance Guide

### Add a New Page

1. Create a new folder under `src/app`.
2. Add a `page.tsx` file inside the folder.
3. Export metadata using the shared `buildMetadata` helper.
4. Add any needed content components under `src/components`.
5. Add the route to `src/constants/index.ts` if it should appear in navigation.

### Add a New Programme

1. Open `src/data/programmes.ts`.
2. Add a new programme object with a unique ID and slug.
3. Add a matching route under `src/app/programmes` if the programme needs its own page.
4. Add the item to the Programmes navigation list if required.

### Add a New Project

1. Open `src/data/projects.ts`.
2. Add a new project object with a unique ID and slug.
3. Link it to the correct programme using `programmeId`.
4. Add image assets under `public/images/projects` when available.

### Update Organization Details

Organization information is managed in:

```text
src/constants/index.ts
```

This includes RHARK's name, abbreviation, description, address, email, phone, mission, vision, social links, impact statistics, core values, and routes.

## 13. Current Implementation Status

| Feature | Status |
|---|---|
| Homepage | Implemented |
| About pages | Implemented |
| Programme pages | Implemented |
| Project listing | Implemented |
| News page | Implemented structure |
| Events page | Implemented structure |
| Publications page | Implemented structure |
| Contact page | Implemented |
| Contact API | Implemented with validation, email sending pending |
| Newsletter API | Implemented with validation, provider integration pending |
| Donation service | Stub prepared, M-Pesa integration pending |
| CMS service | Static data now, CMS-ready service layer prepared |
| SEO metadata | Implemented |
| JSON-LD organization schema | Implemented |
| Accessibility page | Implemented |
| Privacy and terms pages | Implemented |
| Impact dashboard | Implemented with placeholder data |
| Resources page | Implemented with CMS-ready downloads |
| Media Centre page | Implemented |
| Partner With Us page | Implemented |
| Sitemap | Implemented |
| robots.txt | Implemented |
| Partnership inquiry schema | Prepared |
| Donation inquiry schema | Prepared |

## 13.1 Information Architecture

The navigation has been reorganized around the following structure:

- Home
- About: Who We Are, Vision, Mission, Leadership, Partners
- Programs: SRHR, Mental Health, HIV/AIDS, Gender Equality, Governance, Climate Justice
- Projects
- Impact
- Resources
- Publications
- News & Events: News, Events, Media Centre
- Get Involved: Volunteer, Partner With Us, Donate, Internships
- Contact

This improves discoverability by grouping related content and reducing the feel of a flat navigation system.

## 13.2 Prepared Content Types

The project is prepared for future CMS integration with reusable content models for:

- News
- Events
- Projects
- Publications
- Success stories
- Team members
- Partners
- Downloads

The CMS abstraction layer is located at `src/services/cms/index.ts`, with placeholder static data available in `src/data`.

## 14. Security and Data Protection

The project includes several measures that support security and responsible data handling:

- Form validation through Zod.
- Honeypot spam protection on the contact form.
- Environment variable template for secrets.
- Privacy policy page.
- Cookie consent component.
- Separation of API routes from front-end pages.

Recommended improvements before production launch:

- Connect contact form to a trusted transactional email provider.
- Add rate limiting to API routes.
- Add server-side logging and monitoring.
- Add CSRF or origin checks where appropriate.
- Store form submissions securely if database persistence is added.
- Review privacy compliance for Kenya Data Protection Act requirements.

## 15. Testing and Quality Assurance

Recommended checks before deployment:

```bash
npx tsc --noEmit
npm run build
```

Additional QA checklist:

- Verify all navigation links.
- Test all forms with valid and invalid data.
- Test mobile, tablet, and desktop layouts.
- Confirm metadata and social preview information.
- Check page performance with Lighthouse.
- Confirm images load correctly.
- Confirm keyboard navigation and visible focus states.
- Check color contrast on key pages.
- Confirm production environment variables are configured.

## 16. Deployment Notes

The website can be deployed to platforms that support Next.js applications, such as Vercel, Netlify, or a Node.js hosting environment.

Before deployment:

1. Set production environment variables.
2. Set `NEXT_PUBLIC_SITE_URL` to the live domain.
3. Run a production build locally.
4. Confirm API routes work in the hosting environment.
5. Confirm image assets and static files are included.
6. Configure custom domain and SSL.

## 17. Future Enhancements

Recommended future enhancements include:

- Connect a headless CMS for news, events, publications, programmes, and projects.
- Connect contact form to SMTP, Resend, SendGrid, or another email provider.
- Connect newsletter form to Mailchimp, ConvertKit, Brevo, or a custom database.
- Complete M-Pesa Daraja STK Push integration.
- Add donation confirmation and receipt emails.
- Add admin dashboard for managing content and submissions.
- Add search functionality for publications and news.
- Add analytics and conversion tracking.
- Add automated tests for forms and service functions.
- Add sitemap and robots configuration if not already handled by deployment tooling.

## 18. Conclusion

The RHARK website is a structured, scalable, and accessible digital platform for communicating RHARK's work and engaging stakeholders. It already includes the core pages, navigation, programme structure, project data, contact and newsletter APIs, metadata support, and service layers for future integrations.

The project is technically ready for continued content population and production hardening. The most important next steps are to verify final organizational content, add real images and partner data, connect email and newsletter services, and complete the M-Pesa donation integration when the required credentials are available.
