import type { NavItem, ImpactStat, Partner } from "@/types";

// ─── Organisation ─────────────────────────────────────────────────────────────

export const SITE_NAME = "RHARK";
export const SITE_FULL_NAME = "Reproductive Health Action and Rights Kenya";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.rhark.org";
export const SITE_DESCRIPTION =
  "A community-based organization in Siaya County, Kenya, advancing Sexual and Reproductive Health and Rights, gender equality, and youth empowerment.";

export const ORG = {
  name: SITE_FULL_NAME,
  abbreviation: SITE_NAME,
  founded: 2021,
  type: "Community-Based Organization (CBO)",
  country: "Kenya",
  county: "Siaya County",
  address: "Ardhi House, DCC's Building, along Bondo–Kisumu Highway, Bondo Town",
  postalAddress: "P.O. Box 509–40601, Bondo, Kenya",
  email: "info@rhark.org",
  phone: "+254 700 000 000", // placeholder — update with real number
  vision:
    "A society where young people and women are healthy, enlightened, empowered, and free from unmet Sexual and Reproductive Health and Rights (SRHR) needs.",
  mission:
    "To contribute effectively to Sexual and Reproductive Health and Rights (SRHR) and sustainable development through an empowered community that promotes gender equality, women's rights, and youth participation.",
} as const;

// ─── Social Media ─────────────────────────────────────────────────────────────

export const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/RHARK-107471191627975",
  twitter: "https://twitter.com/RHARK7?s=03",
  instagram: "https://www.instagram.com/p/CRv_3AOMiGT/?utm_medium=copy_link",
  linkedin: "https://www.linkedin.com/company/reproductive-health-accountability-and-response-kenya-rhark/",
} as const;

// ─── Navigation ───────────────────────────────────────────────────────────────

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About",
    href: "/about",
    children: [
      { label: "Who We Are", href: "/about", description: "Our story, vision, and mission" },
      { label: "Vision", href: "/about#vision", description: "The future RHARK is working toward" },
      { label: "Mission", href: "/about#mission", description: "How RHARK advances health and rights" },
      { label: "Leadership", href: "/about/team", description: "Meet the people behind RHARK" },
      { label: "Partners", href: "/about/partners", description: "Our funders and collaborators" },
      { label: "Core Values", href: "/about#values", description: "What guides our work" },
    ],
  },
  {
    label: "Programs",
    href: "/programmes",
    children: [
      { label: "SRHR", href: "/programmes/srhr", description: "Sexual & Reproductive Health and Rights" },
      { label: "Mental Health", href: "/programmes/mental-health", description: "Mental Health and Wellness" },
      { label: "HIV/AIDS", href: "/programmes/hiv-teen-pregnancy", description: "HIV and teen pregnancy prevention" },
      { label: "Gender Equality", href: "/programmes/gender-equality", description: "Empowerment initiatives" },
      { label: "Governance", href: "/programmes/governance-policy", description: "Policy advocacy and engagement" },
      { label: "Climate Justice", href: "/programmes/climate-justice", description: "Environmental health" },
    ],
  },
  { label: "Projects", href: "/projects" },
  { label: "Impact", href: "/impact" },
  { label: "Resources", href: "/resources" },
  { label: "Publications", href: "/publications" },
  {
    label: "News & Events",
    href: "/news",
    children: [
      { label: "News", href: "/news", description: "Latest updates and stories" },
      { label: "Events", href: "/events", description: "Upcoming and past events" },
      { label: "Media Centre", href: "/media-centre", description: "Press resources and media contacts" },
    ],
  },
  {
    label: "Get Involved",
    href: "/get-involved",
    children: [
      { label: "Volunteer", href: "/get-involved/volunteer", description: "Join our volunteer network" },
      { label: "Partner With Us", href: "/get-involved/partner", description: "Collaborate with RHARK" },
      { label: "Donate", href: "/get-involved/donate", description: "Support our work" },
      { label: "Internships", href: "/get-involved/internship", description: "Internship opportunities" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

// ─── Impact Statistics (placeholder — replace with real data) ─────────────────

export const IMPACT_STATS: ImpactStat[] = [
  { id: "1", value: 5000, suffix: "+", label: "Youth Reached", description: "Young people impacted by our programs" },
  { id: "2", value: 2500, suffix: "+", label: "Women Empowered", description: "Women and girls supported through community initiatives" },
  { id: "3", value: 120, suffix: "+", label: "Community Dialogues", description: "Dialogues held with youth, parents, leaders, and duty bearers" },
  { id: "4", value: 45, suffix: "+", label: "Schools Engaged", description: "Schools reached through clubs, talks, and referrals" },
  { id: "5", value: 12, label: "Active Projects", description: "Ongoing community projects" },
  { id: "6", value: 8, label: "Counties Served", description: "Across Western Kenya" },
  { id: "7", value: 30, suffix: "+", label: "Partner Organizations", description: "Funders and implementing partners" },
];

// ─── Core Values ──────────────────────────────────────────────────────────────

export const CORE_VALUES = [
  { title: "Transparency & Accountability", description: "We operate with openness and are answerable to our communities and partners." },
  { title: "Equity & Intersectionality", description: "We recognize and address overlapping systems of discrimination." },
  { title: "Integrity", description: "We uphold the highest ethical standards in all our work." },
  { title: "Innovation", description: "We embrace creative solutions to complex health and rights challenges." },
  { title: "Collaboration", description: "We build strong partnerships to amplify our collective impact." },
] as const;

// ─── Placeholder Partners ─────────────────────────────────────────────────────

export const PARTNERS: Partner[] = [
  // Populated when real partner data is available
];

// ─── Routes ───────────────────────────────────────────────────────────────────

export const ROUTES = {
  home: "/",
  about: "/about",
  team: "/about/team",
  partners: "/about/partners",
  programmes: "/programmes",
  projects: "/projects",
  impact: "/impact",
  resources: "/resources",
  news: "/news",
  events: "/events",
  mediaCentre: "/media-centre",
  publications: "/publications",
  volunteer: "/get-involved/volunteer",
  partner: "/get-involved/partner",
  internship: "/get-involved/internship",
  donate: "/get-involved/donate",
  contact: "/contact",
} as const;
