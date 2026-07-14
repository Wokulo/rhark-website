when # RHARK Website

A Next.js website for Reproductive Health Action and Rights Kenya (RHARK), a community-based organization in Siaya County advancing Sexual and Reproductive Health and Rights, gender equality, and youth empowerment.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **Deployment:** Vercel (recommended)

---

## How to Update the Website

### Prerequisites

- Node.js 18+ installed
- Git installed
- Code editor (VS Code recommended)

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/Wokulo/rhark-website.git
cd rhark-website
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Run Locally

\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000` to preview changes.

### 4. Update Site Content

#### Update Navigation Items

Edit `src/constants/index.ts`:

\`\`\`ts
export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  // Add, remove, or reorder menu items here
];
\`\`\`

#### Update Routes

Edit `src/constants/index.ts`:

\`\`\`ts
export const ROUTES = {
  home: "/",
  about: "/about",
  // Update or add new routes here
} as const;
\`\`\`

#### Update Organisation Info

Edit `src/constants/index.ts`:

\`\`\`ts
export const ORG = {
  name: "Reproductive Health Action and Rights Kenya",
  email: "info@rhark.org",
  phone: "+254 700 000 000",
  address: "Ardhi House, DCC's Building, along Bondo–Kisumu Highway, Bondo Town",
  // Update other fields here
} as const;
\`\`\`

#### Update Social Media Links

Edit `src/constants/index.ts`:

\`\`\`ts
export const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/RHARK-107471191627975",
  twitter: "https://twitter.com/RHARK",
  instagram: "https://www.instagram.com/p/CRv_utm_medium=copy_link",
  linkedin: "https://www.linkedin.com/company/reproductive-health-accountability-and-response-kenya-rhark/",
} as const;
\`\`\`

#### Update Impact Statistics

Edit `src/constants/index.ts`:

\`\`\`ts
export const IMPACT_STATS: ImpactStat[] = [
  { id: "1", value: 5000, suffix: "+", label: "Youth Reached", description: "Young people impacted by our programmes" },
  // Update stats here
];
\`\`\`

#### Update Programmes

Edit `src/constants/index.ts` (Footer.tsx for footer programmes list):

\`\`\`ts
const PROGRAMMES = [
  { label: "SRHR", href: "/programmes/srhr" },
  // Add or edit programmes
];
\`\`\`

#### Add a New Page

1. Create a new file in `src/app/[page-name]/page.tsx`
2. Add the route to `ROUTES` in `src/constants/index.ts`
3. Update the sitemap in `src/app/sitemap.ts` if needed

#### Update Footer Links

Edit `src/components/layout/Footer.tsx`:

\`\`\`ts
const QUICK_LINKS = [
  { label: "About RHARK", href: ROUTES.about },
  // Update quick links
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  // Update legal links
];
\`\`\`

### 5. Update Images

#### Replace Logo

Replace the logo files in the `public/` folder. The logo is rendered in `src/components/layout/Header.tsx` and `src/components/layout/Footer.tsx`.

#### Replace Hero/Background Images

Images are loaded from Unsplash or the `public/` folder. To use a custom image:

1. Place the image in the `public/` folder
2. Update the component referencing the image (e.g., `src/components/home/HeroSection.tsx`)

\`\`\`tsx
<Image src="/images/your-image.jpg" alt="Description" width={1200} height={600} />
\`\`\`

#### Update Social Media / Open Graph Images

Replace images in `public/` and update references in:
- `src/app/layout.tsx` (metadata)
- `src/app/globals.css` (if used as background)

### 6. Update Styles

Global styles are in `src/app/globals.css`. Component-specific styles use Tailwind utility classes.

To modify the color scheme, edit `tailwind.config.ts`.

### 7. Commit and Push Changes

\`\`\`bash
git add .
git commit -m "Update: description of changes"
git push origin main
\`\`\`

### 8. Deploy

The site is configured for Vercel. Connect the GitHub repository to Vercel for automatic deployments on every push to `main`.

---

## Project Structure

\`\`\`
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Homepage
│   ├── about/              # About pages
│   ├── programmes/         # Programme pages
│   ├── contact/            # Contact page
│   └── ...
├── components/
│   ├── home/               # Homepage sections
│   ├── layout/             # Header, Footer, CookieConsent
│   ├── system/             # Reusable UI components
│   └── ui/                 # UI primitives
├── constants/              # Site data, routes, navigation
├── lib/                    # Utilities and validations
├── types/                  # TypeScript types
└── app/
    └── globals.css         # Global styles and Tailwind
public/                     # Static assets (images, favicon, etc.)
\`\`\`

---

## Important Notes

- **Newsletter:** The newsletter API endpoint is at `src/app/api/newsletter/route.ts`. Wire it up to Mailchimp or another provider in production.
- **Donations:** The donate button links to `/get-involved/donate`. Update the donation instructions or link to an external payment processor.
- **Contact Form:** The contact form in `src/app/contact/page.tsx` is a client-side demo. Connect it to an email service or API for production.
- **Security Headers:** Configured in `next.config.ts`. Tighten the Content Security Policy before going live.
- **Environment Variables:** Create a `.env.local` file for any secrets. Never commit `.env.local` to Git.

---

## Support

For questions or issues, contact the RHARK team at info@rhark.org.