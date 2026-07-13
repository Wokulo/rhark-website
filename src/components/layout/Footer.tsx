import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Heart,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { ORG, SOCIAL_LINKS, ROUTES } from "@/constants";

// ─── Data ─────────────────────────────────────────────────────────────────────

const SOCIAL_ICONS = [
  { href: SOCIAL_LINKS.facebook, Icon: Facebook, label: "Facebook" },
  { href: SOCIAL_LINKS.twitter, Icon: Twitter, label: "Twitter / X" },
  { href: SOCIAL_LINKS.instagram, Icon: Instagram, label: "Instagram" },
  { href: SOCIAL_LINKS.linkedin, Icon: Linkedin, label: "LinkedIn" },
];

const PROGRAMMES = [
  { label: "Sexual & Reproductive Health Rights", href: "/programmes/srhr", short: "SRHR" },
  { label: "Mental Health & Wellness", href: "/programmes/mental-health", short: "Mental Health" },
  { label: "HIV/AIDS & Teen Pregnancy Prevention", href: "/programmes/hiv-teen-pregnancy", short: "HIV Prevention" },
  { label: "Gender Equality & Empowerment", href: "/programmes/gender-equality", short: "Gender Equality" },
  { label: "Governance & Policy Engagement", href: "/programmes/governance-policy", short: "Governance" },
  { label: "Climate Justice", href: "/programmes/climate-justice", short: "Climate Justice" },
];

const QUICK_LINKS = [
  { label: "About RHARK", href: ROUTES.about },
  { label: "Our Team", href: ROUTES.team },
  { label: "Projects", href: ROUTES.projects },
  { label: "News & Blog", href: ROUTES.news },
  { label: "Publications", href: ROUTES.publications },
  { label: "Events", href: ROUTES.events },
  { label: "Volunteer", href: ROUTES.volunteer },
  { label: "Contact Us", href: ROUTES.contact },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
  { label: "Accessibility Statement", href: "/accessibility" },
  { label: "Sitemap", href: "/sitemap.xml", isExternal: true },
];

// ─── Footer ───────────────────────────────────────────────────────────────────

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 text-neutral-300" role="contentinfo">
      {/* ── Donation CTA Strip ── */}
      <section aria-label="Donation call to action">
        <div className="border-b border-neutral-800 bg-neutral-950">
          <div className="mx-auto max-w-[1280px] flex flex-col items-center gap-3 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <div className="text-center sm:text-left">
              <h2 className="font-display text-lg font-bold text-white">
                Support our work in Siaya County
              </h2>
              <p className="mt-1 text-sm text-neutral-400">
                Your contribution funds SRHR programmes, mental health support, and youth empowerment.
              </p>
            </div>
            <Link
              href={ROUTES.donate}
              className={
                "inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-amber sm:w-auto " +
                "transition-all duration-150 hover:bg-accent-600 hover:shadow-amber " +
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
              }
            >
              <Heart size={16} aria-hidden="true" fill="currentColor" />
              Donate Now
            </Link>
          </div>
        </div>
      </section>

      {/* ── Main Footer Grid ── */}
      <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-10">

          {/* Column 1: Brand + Social + Newsletter */}
          <div>
            {/* Logo */}
            <Link
              href="/"
              className="group inline-flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
              aria-label="RHARK homepage"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500 transition-colors duration-150 group-hover:bg-primary-400">
                <Heart size={20} className="text-white" aria-hidden="true" fill="currentColor" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display text-xl font-extrabold text-white">RHARK</span>
                <span className="text-[10px] font-medium tracking-wide text-neutral-500">Kenya</span>
              </div>
            </Link>

            <p className="text-sm leading-relaxed text-neutral-400">
              {ORG.name} — advancing Sexual and Reproductive Health and Rights, gender equality, and youth empowerment in Siaya County, Kenya.
            </p>

            <p className="text-xs text-neutral-500">
              Established {ORG.founded} · {ORG.type}
            </p>

            {/* Social links */}
            <div
              className="mt-4 flex items-center gap-2"
              aria-label="Follow RHARK on social media"
            >
              {SOCIAL_ICONS.map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow RHARK on ${label} (opens in new tab)`}
                  className={
                    "flex h-11 w-11 items-center justify-center rounded-full bg-neutral-800 text-neutral-400 " +
                    "transition-all duration-200 ease-out hover:scale-110 hover:bg-primary-500 hover:text-white " +
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
                  }
                >
                  <Icon size={18} aria-hidden="true" />
                </a>
              ))}
             </div>
           </div>

          {/* Column 2: Programmes */}
          <div>
            <h3 className="text-base font-bold text-neutral-100 mb-3">
              Programmes
            </h3>
            <ul className="space-y-3" role="list">
              {PROGRAMMES.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={
                      "group flex items-center gap-2.5 text-sm leading-relaxed text-neutral-400 " +
                      "transition-colors duration-150 hover:text-primary-400 " +
                      "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-400 rounded"
                    }
                  >
                    <ArrowRight
                      size={14}
                      aria-hidden="true"
                      className="shrink-0 opacity-0 transition-all duration-150 group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div>
            <h3 className="text-base font-bold text-neutral-100 mb-3">
              Quick Links
            </h3>
            <ul className="space-y-3" role="list">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={
                      "block text-sm leading-relaxed text-neutral-400 transition-colors duration-150 hover:text-primary-400 " +
                      "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-400 rounded"
                    }
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="text-base font-bold text-neutral-100 mb-3">
              Contact Us
            </h3>
            <address className="not-italic space-y-5">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-800">
                  <MapPin size={16} className="text-primary-400" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    Head Office
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-neutral-400">
                    {ORG.address}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-neutral-500">
                    {ORG.postalAddress}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-800">
                  <Mail size={16} className="text-primary-400" aria-hidden="true" />
                </div>
                <a
                  href={`mailto:${ORG.email}`}
                  className="text-sm leading-relaxed text-neutral-400 transition-colors duration-150 hover:text-primary-400"
                >
                  {ORG.email}
                </a>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-800">
                  <Phone size={16} className="text-primary-400" aria-hidden="true" />
                </div>
                <a
                  href={`tel:${ORG.phone.replace(/\s/g, "")}`}
                  className="text-sm leading-relaxed text-neutral-400 transition-colors duration-150 hover:text-primary-400"
                >
                  {ORG.phone}
                </a>
              </div>
            </address>

            {/* Map link */}
            <a
              href="https://maps.google.com/?q=Bondo+Town+Siaya+County+Kenya"
              target="_blank"
              rel="noopener noreferrer"
              className={
                "mt-4 inline-flex items-center gap-1.5 rounded-lg border border-neutral-700 px-3 py-2 text-xs font-medium text-neutral-400 " +
                "transition-colors duration-150 hover:border-primary-500 hover:text-primary-400 " +
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-400"
              }
            >
              <MapPin size={12} aria-hidden="true" />
              View on Google Maps
              <ExternalLink size={10} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="border-t border-neutral-800">
        <div className="mx-auto max-w-[1280px] flex flex-col items-center justify-between gap-3 px-4 py-4 sm:flex-row sm:px-6 lg:flex-row lg:px-8">
          <p className="text-xs text-neutral-500">
            © {year}{" "}
            <Link
              href="/"
              className="text-neutral-400 transition-colors duration-150 hover:text-neutral-200"
            >
              {ORG.name}
            </Link>
            . All rights reserved. Registered CBO, Kenya.
          </p>
          <nav aria-label="Legal and policy links" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-neutral-500 transition-colors duration-150 hover:text-neutral-300"
                {...(link.isExternal
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
