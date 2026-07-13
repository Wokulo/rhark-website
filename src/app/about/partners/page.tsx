import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { ROUTES } from "@/constants";

export const metadata: Metadata = buildMetadata({
  title: "Our Partners",
  description: "RHARK's funders, implementing partners, and government collaborators driving health and rights in Kenya.",
  path: "/about/partners",
});

const PARTNER_TYPES = [
  { type: "Government Partners", partners: ["Siaya County Government", "Ministry of Health Kenya", "National AIDS Control Council"] },
  { type: "Development Partners", partners: ["UNFPA Kenya", "WHO Kenya", "UNICEF Kenya"] },
  { type: "Implementing Partners", partners: ["Amref Health Africa", "Kenya Red Cross Society", "KEMRI"] },
  { type: "Academic & Research", partners: ["University of Nairobi", "Maseno University", "Kenya Medical Training College"] },
];

export default function PartnersPage() {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 py-24 lg:py-32" aria-labelledby="partners-hero-heading">
        <div className="container-site text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-primary-200">Collaboration</p>
          <h1 id="partners-hero-heading" className="mt-3 font-display text-4xl font-extrabold text-white text-balance lg:text-5xl">
            Our Partners &amp; Supporters
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-primary-200">
            RHARK works with a diverse network of partners to amplify our impact across Kenya.
          </p>
          <nav aria-label="Breadcrumb" className="mt-6 flex items-center justify-center gap-2 text-sm text-primary-300">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href={ROUTES.about} className="hover:text-white transition-colors">About</Link>
            <span aria-hidden="true">/</span>
            <span className="text-white" aria-current="page">Partners</span>
          </nav>
        </div>
      </section>

      <section className="py-20 lg:py-28" aria-labelledby="partners-list-heading">
        <div className="container-site">
          <h2 id="partners-list-heading" className="sr-only">Partner Categories</h2>
          <div className="grid gap-10 md:grid-cols-2">
            {PARTNER_TYPES.map((group) => (
              <div key={group.type} className="rounded-2xl bg-neutral-50 p-8 ring-1 ring-neutral-200">
                <h3 className="font-display text-lg font-bold text-neutral-900">{group.type}</h3>
                <ul className="mt-4 space-y-3" role="list">
                  {group.partners.map((partner) => (
                    <li key={partner} className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-sm font-medium text-neutral-700 ring-1 ring-neutral-100">
                      <span className="h-2 w-2 shrink-0 rounded-full bg-primary-400" aria-hidden="true" />
                      {partner}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-2xl bg-primary-50 p-8 text-center ring-1 ring-primary-100">
            <h3 className="font-display text-xl font-bold text-neutral-900">Become a Partner</h3>
            <p className="mx-auto mt-3 max-w-md text-base text-neutral-600">
              We welcome partnerships with organizations that share our commitment to health, rights, and community empowerment.
            </p>
            <Link href={ROUTES.contact} className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary-500 px-6 py-3 text-sm font-bold text-white shadow-teal-sm transition-all duration-200 hover:bg-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2">
              Get in Touch <ExternalLink size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
