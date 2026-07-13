import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import Link from "next/link";
import { Users, CheckCircle2, ArrowRight } from "lucide-react";
import { ROUTES } from "@/constants";
export const metadata: Metadata = buildMetadata({ title: "Gender Equality & Empowerment", path: "/programmes/gender-equality" });
export default function GenderPage() {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-primary-500 to-primary-700 py-24 lg:py-32" aria-labelledby="gender-heading">
        <div className="container-site">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 mb-6"><Users size={30} className="text-white" aria-hidden="true" /></div>
          <h1 id="gender-heading" className="font-display text-4xl font-extrabold text-white text-balance lg:text-5xl max-w-2xl">Gender Equality &amp; Empowerment</h1>
          <p className="mt-5 max-w-xl text-lg text-white/80">Challenging harmful gender norms and empowering girls and women to participate fully in society.</p>
          <nav aria-label="Breadcrumb" className="mt-6 flex items-center gap-2 text-sm text-white/70">
            <Link href="/" className="hover:text-white transition-colors">Home</Link><span aria-hidden="true">/</span>
            <Link href={ROUTES.programmes} className="hover:text-white transition-colors">Programmes</Link><span aria-hidden="true">/</span>
            <span className="text-white" aria-current="page">Gender Equality</span>
          </nav>
        </div>
      </section>
      <section className="py-20 lg:py-28">
        <div className="container-site grid gap-14 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-5 text-base leading-relaxed text-neutral-600">
            <h2 className="font-display text-2xl font-bold text-neutral-900">About This Programme</h2>
            <p>Gender inequality remains a root cause of poor health outcomes, limited economic opportunities, and gender-based violence in Siaya County. RHARK's Gender Equality and Empowerment programme works to transform the social norms, attitudes, and structures that perpetuate inequality.</p>
            <p>We engage men and boys as allies, support women's economic empowerment, advocate for girls' education, and provide survivors of gender-based violence with access to support services and justice.</p>
            <h3 className="font-display text-xl font-bold text-neutral-900 mt-8">Key Objectives</h3>
            <ul className="space-y-3" role="list">
              {["Eliminate gender-based violence in target communities","Increase women's economic empowerment and financial inclusion","Promote girls' education and school retention","Engage men and boys as champions of gender equality","Strengthen legal and policy frameworks for women's rights"].map((obj) => (
                <li key={obj} className="flex items-start gap-3"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-primary-500" aria-hidden="true" />{obj}</li>
              ))}
            </ul>
          </div>
          <aside className="space-y-6">
            <div className="rounded-2xl bg-primary-50 p-6 ring-1 ring-primary-100">
              <h3 className="font-display text-base font-bold text-neutral-900">Target Beneficiaries</h3>
              <ul className="mt-3 space-y-2" role="list">
                {["Women and Girls","Men and Boys","GBV Survivors","Community Leaders","Schools and Youth Groups"].map((b) => (
                  <li key={b} className="text-sm text-neutral-600 flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary-400 shrink-0" aria-hidden="true" />{b}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-neutral-50 p-6 ring-1 ring-neutral-200">
              <h3 className="font-display text-base font-bold text-neutral-900">Get Involved</h3>
              <p className="mt-2 text-sm text-neutral-500">Champion gender equality with RHARK.</p>
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
