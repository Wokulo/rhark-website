import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import Link from "next/link";
import { Heart, CheckCircle2, ArrowRight } from "lucide-react";
import { ROUTES } from "@/constants";

export const metadata: Metadata = buildMetadata({ title: "SRHR Programme", path: "/programmes/srhr" });

export default function SRHRPage() {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 py-24 lg:py-32" aria-labelledby="srhr-heading">
        <div className="container-site">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 mb-6">
            <Heart size={30} className="text-white" aria-hidden="true" />
          </div>
          <h1 id="srhr-heading" className="font-display text-4xl font-extrabold text-white text-balance lg:text-5xl max-w-2xl">
            Sexual &amp; Reproductive Health and Rights
          </h1>
          <p className="mt-5 max-w-xl text-lg text-primary-200">
            Advancing access to comprehensive SRHR information, services, and rights for young people and women in Siaya County.
          </p>
          <nav aria-label="Breadcrumb" className="mt-6 flex items-center gap-2 text-sm text-primary-300">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href={ROUTES.programmes} className="hover:text-white transition-colors">Programmes</Link>
            <span aria-hidden="true">/</span>
            <span className="text-white" aria-current="page">SRHR</span>
          </nav>
        </div>
      </section>
      <section className="py-20 lg:py-28">
        <div className="container-site grid gap-14 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6 text-base leading-relaxed text-neutral-600">
            <h2 className="font-display text-2xl font-bold text-neutral-900">About This Programme</h2>
            <p>RHARK's SRHR programme is our flagship initiative, addressing the persistent unmet needs in sexual and reproductive health among young people and women in Siaya County. We work to ensure that every individual has access to accurate information, quality services, and the rights to make informed decisions about their bodies and health.</p>
            <p>Through community outreach, school-based education, health facility linkages, and policy advocacy, we reach thousands of youth, adolescents, and women annually with life-changing SRHR information and services.</p>
            <h3 className="font-display text-xl font-bold text-neutral-900 mt-8">Key Objectives</h3>
            <ul className="space-y-3" role="list">
              {["Increase access to SRHR information and services among youth and women","Reduce unmet need for family planning in Siaya County","Strengthen community health systems for SRHR service delivery","Advocate for SRHR-friendly policies at county and national level","Empower young people to make informed decisions about their health"].map((obj) => (
                <li key={obj} className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-primary-500" aria-hidden="true" />
                  {obj}
                </li>
              ))}
            </ul>
          </div>
          <aside className="space-y-6">
            <div className="rounded-2xl bg-primary-50 p-6 ring-1 ring-primary-100">
              <h3 className="font-display text-base font-bold text-neutral-900">Target Beneficiaries</h3>
              <ul className="mt-3 space-y-2" role="list">
                {["Youth (15–24 years)","Adolescents (10–14 years)","Women of reproductive age","Community Health Volunteers","Healthcare Professionals"].map((b) => (
                  <li key={b} className="text-sm text-neutral-600 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-400 shrink-0" aria-hidden="true" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-neutral-50 p-6 ring-1 ring-neutral-200">
              <h3 className="font-display text-base font-bold text-neutral-900">Get Involved</h3>
              <p className="mt-2 text-sm text-neutral-500">Support our SRHR work through volunteering, donations, or partnerships.</p>
              <Link href={ROUTES.donate} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent-500 px-5 py-3 text-sm font-bold text-white shadow-amber transition-colors hover:bg-accent-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2">
                Support This Programme <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
