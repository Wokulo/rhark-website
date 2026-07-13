import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import Link from "next/link";
import { Landmark, CheckCircle2, ArrowRight } from "lucide-react";
import { ROUTES } from "@/constants";
export const metadata: Metadata = buildMetadata({ title: "Governance & Policy Engagement", path: "/programmes/governance-policy" });
export default function GovernancePage() {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-info-600 to-info-800 py-24 lg:py-32" aria-labelledby="gov-heading">
        <div className="container-site">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 mb-6"><Landmark size={30} className="text-white" aria-hidden="true" /></div>
          <h1 id="gov-heading" className="font-display text-4xl font-extrabold text-white text-balance lg:text-5xl max-w-2xl">Governance &amp; Policy Engagement</h1>
          <p className="mt-5 max-w-xl text-lg text-white/80">Engaging government institutions and policymakers to create enabling environments for SRHR and gender equality.</p>
          <nav aria-label="Breadcrumb" className="mt-6 flex items-center gap-2 text-sm text-white/70">
            <Link href="/" className="hover:text-white transition-colors">Home</Link><span aria-hidden="true">/</span>
            <Link href={ROUTES.programmes} className="hover:text-white transition-colors">Programmes</Link><span aria-hidden="true">/</span>
            <span className="text-white" aria-current="page">Governance &amp; Policy</span>
          </nav>
        </div>
      </section>
      <section className="py-20 lg:py-28">
        <div className="container-site grid gap-14 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-5 text-base leading-relaxed text-neutral-600">
            <h2 className="font-display text-2xl font-bold text-neutral-900">About This Programme</h2>
            <p>Sustainable change requires enabling policy environments. RHARK's Governance and Policy Engagement programme works to influence county and national policies that affect SRHR, gender equality, and community health outcomes.</p>
            <p>We build the capacity of civil society organizations, engage county government officials, and mobilize communities to participate in governance processes that affect their health and rights.</p>
            <h3 className="font-display text-xl font-bold text-neutral-900 mt-8">Key Objectives</h3>
            <ul className="space-y-3" role="list">
              {["Influence county health and gender policies","Strengthen accountability mechanisms in health governance","Build civil society capacity for evidence-based advocacy","Promote community participation in governance","Monitor implementation of SRHR-related policies"].map((obj) => (
                <li key={obj} className="flex items-start gap-3"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-info-500" aria-hidden="true" />{obj}</li>
              ))}
            </ul>
          </div>
          <aside className="space-y-6">
            <div className="rounded-2xl bg-info-50 p-6 ring-1 ring-info-100">
              <h3 className="font-display text-base font-bold text-neutral-900">Target Beneficiaries</h3>
              <ul className="mt-3 space-y-2" role="list">
                {["Government Institutions","Civil Society Organizations","Community Leaders","Development Partners","Researchers & Academics"].map((b) => (
                  <li key={b} className="text-sm text-neutral-600 flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-info-400 shrink-0" aria-hidden="true" />{b}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-neutral-50 p-6 ring-1 ring-neutral-200">
              <h3 className="font-display text-base font-bold text-neutral-900">Get Involved</h3>
              <p className="mt-2 text-sm text-neutral-500">Support our advocacy and policy work.</p>
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
