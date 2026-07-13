import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import Link from "next/link";
import { FileText, Download, ArrowRight } from "lucide-react";
import { ROUTES } from "@/constants";

export const metadata: Metadata = buildMetadata({
  title: "Publications",
  description: "Download RHARK's annual reports, research papers, policy briefs, factsheets, and newsletters.",
  path: "/publications",
});

const PUBLICATIONS = [
  { title: "RHARK Annual Report 2024", type: "Annual Report", year: "2024", description: "A comprehensive review of RHARK's programmes, impact, financial accountability, and strategic direction for 2025.", pages: 48, typeColor: "bg-primary-100 text-primary-700" },
  { title: "SRHR Needs Assessment — Siaya County 2024", type: "Research", year: "2024", description: "Findings from a community-based needs assessment on sexual and reproductive health and rights among youth aged 15–24 in Siaya County.", pages: 32, typeColor: "bg-accent-100 text-accent-700" },
  { title: "Mental Health Policy Brief: Integrating Mental Health into Primary Care", type: "Policy Brief", year: "2024", description: "Evidence-based recommendations for integrating mental health services into primary healthcare facilities in Siaya County.", pages: 12, typeColor: "bg-secondary-100 text-secondary-600" },
  { title: "Gender-Based Violence Factsheet 2024", type: "Factsheet", year: "2024", description: "Key statistics and findings on gender-based violence prevalence, reporting, and response in Siaya County.", pages: 4, typeColor: "bg-info-50 text-info-600" },
  { title: "RHARK Newsletter — Q4 2024", type: "Newsletter", year: "2024", description: "Quarterly newsletter featuring programme updates, success stories, upcoming events, and volunteer spotlights.", pages: 8, typeColor: "bg-success-50 text-success-600" },
  { title: "RHARK Annual Report 2023", type: "Annual Report", year: "2023", description: "RHARK's second annual report documenting our growth, programme achievements, and community impact in 2023.", pages: 44, typeColor: "bg-primary-100 text-primary-700" },
];

const TYPES = ["All", "Annual Report", "Research", "Policy Brief", "Factsheet", "Newsletter"];

export default function PublicationsPage() {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 py-24 lg:py-32" aria-labelledby="pubs-hero-heading">
        <div className="container-site text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-primary-200">Knowledge Hub</p>
          <h1 id="pubs-hero-heading" className="mt-3 font-display text-4xl font-extrabold text-white text-balance lg:text-5xl">
            Publications
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-primary-200">
            Annual reports, research, policy briefs, factsheets, and newsletters from RHARK.
          </p>
          <nav aria-label="Breadcrumb" className="mt-6 flex items-center justify-center gap-2 text-sm text-primary-300">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span aria-hidden="true">/</span>
            <span className="text-white" aria-current="page">Publications</span>
          </nav>
        </div>
      </section>

      <section className="py-20 lg:py-28" aria-labelledby="pubs-list-heading">
        <div className="container-site">
          <div className="mb-10 flex flex-wrap gap-2" role="list" aria-label="Filter by type">
            {TYPES.map((type, i) => (
              <span key={type} role="listitem" className={`rounded-full px-4 py-2 text-sm font-semibold cursor-default ${i === 0 ? "bg-primary-500 text-white" : "bg-neutral-100 text-neutral-600"}`}>
                {type}
              </span>
            ))}
          </div>

          <h2 id="pubs-list-heading" className="sr-only">All Publications</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {PUBLICATIONS.map((pub) => (
              <article
                key={pub.title}
                className="group flex flex-col rounded-2xl bg-neutral-50 p-6 ring-1 ring-neutral-200 transition-all duration-250 hover:shadow-lg hover:ring-neutral-300"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
                  <FileText size={24} className="text-primary-500" aria-hidden="true" />
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${pub.typeColor}`}>
                    {pub.type}
                  </span>
                  <span className="text-xs text-neutral-400">{pub.year}</span>
                </div>
                <h3 className="mt-3 font-display text-base font-bold leading-snug text-neutral-900 group-hover:text-primary-600 transition-colors duration-150">
                  {pub.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-500">{pub.description}</p>
                <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-4">
                  <span className="text-xs text-neutral-400">{pub.pages} pages</span>
                  <button
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary-500 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                    aria-label={`Download ${pub.title}`}
                  >
                    <Download size={12} aria-hidden="true" /> Download
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
