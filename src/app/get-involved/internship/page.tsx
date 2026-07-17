import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, CheckCircle2 } from "lucide-react";
import { ROUTES } from "@/constants";
import { buildMetadata } from "@/lib/metadata";
import InternshipForm from "./internship-form";

export const metadata: Metadata = buildMetadata({
  title: "Internship Opportunities",
  description: "Apply for an internship with RHARK and gain hands-on experience in public health, gender, advocacy, and community development in Kenya.",
  path: "/get-involved/internship",
});

const AREAS = ["Sexual & Reproductive Health","Mental Health & Wellness","Gender Equality & GBV","Research & Monitoring","Communications & Media","Finance & Administration","IT & Digital Systems","Governance & Advocacy"];
const REQUIREMENTS = ["Currently enrolled in or recently graduated from a relevant degree programme","Passionate about health, rights, and community development","Available for a minimum of 3 months","Based in or willing to relocate to Siaya County (or remote for select roles)","Strong communication and interpersonal skills"];

export default function InternshipPage() {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-secondary-500 to-secondary-700 py-24 lg:py-32" aria-labelledby="intern-hero-heading">
        <div className="container-site text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
            <BookOpen size={30} className="text-white" aria-hidden="true" />
          </div>
          <h1 id="intern-hero-heading" className="font-display text-4xl font-extrabold text-white text-balance lg:text-5xl">
            Internship Opportunities
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/85">
            Gain hands-on experience in public health, gender, advocacy, and community development with a leading Kenyan CBO.
          </p>
          <nav aria-label="Breadcrumb" className="mt-6 flex items-center justify-center gap-2 text-sm text-white/70">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span aria-hidden="true">/</span>
            <span className="text-white" aria-current="page">Internship</span>
          </nav>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="container-site grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div className="space-y-8">
            <div>
              <h2 className="font-display text-2xl font-bold text-neutral-900">About Our Internship Programme</h2>
              <div className="mt-4 space-y-4 text-base leading-relaxed text-neutral-600">
                <p>RHARK's internship programme offers students and recent graduates the opportunity to gain practical experience in a dynamic community-based organization working at the intersection of health, rights, and development.</p>
                <p>Interns work directly with our programme teams, contributing to real projects and gaining skills that will serve them throughout their careers.</p>
              </div>
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-neutral-900">Internship Areas</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {AREAS.map((area) => (
                  <span key={area} className="rounded-full bg-secondary-50 px-4 py-2 text-sm font-medium text-secondary-700 ring-1 ring-secondary-100">{area}</span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-neutral-900">What We Offer</h3>
              <ul className="mt-4 space-y-3" role="list">
                {["Structured learning and mentorship","Exposure to real community health programmes","Professional development workshops","Certificate of completion","Potential for employment upon graduation"].map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-neutral-600">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-secondary-400" aria-hidden="true" />{b}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl bg-neutral-50 p-8 ring-1 ring-neutral-200">
              <h3 className="font-display text-lg font-bold text-neutral-900">Requirements</h3>
              <ul className="mt-4 space-y-3" role="list">
                {REQUIREMENTS.map((r) => (
                  <li key={r} className="flex items-start gap-2 text-sm text-neutral-600">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-primary-500" aria-hidden="true" />{r}
                  </li>
                ))}
              </ul>
            </div>

            <InternshipForm />
          </div>
        </div>
      </section>
    </div>
  );
}
