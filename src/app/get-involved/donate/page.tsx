import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import Link from "next/link";
import { Heart, ArrowRight, CheckCircle2 } from "lucide-react";
import { ROUTES, ORG } from "@/constants";

export const metadata: Metadata = buildMetadata({
  title: "Donate",
  description: "Support RHARK's work advancing SRHR, gender equality, and youth empowerment in Siaya County, Kenya.",
  path: "/get-involved/donate",
});

const DONATION_AMOUNTS = [500, 1000, 2500, 5000, 10000];

const IMPACT = [
  { amount: "KES 500", impact: "Provides SRHR educational materials for 5 youth" },
  { amount: "KES 1,000", impact: "Funds a community health volunteer training session" },
  { amount: "KES 2,500", impact: "Supports a mental health peer support group for one month" },
  { amount: "KES 5,000", impact: "Covers transport and supplies for a community outreach day" },
  { amount: "KES 10,000", impact: "Sponsors a youth gender equality workshop for 30 participants" },
];

export default function DonatePage() {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-accent-500 to-accent-700 py-24 lg:py-32" aria-labelledby="donate-hero-heading">
        <div className="container-site text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
            <Heart size={30} className="text-white" aria-hidden="true" fill="currentColor" />
          </div>
          <h1 id="donate-hero-heading" className="font-display text-4xl font-extrabold text-white text-balance lg:text-5xl">
            Support Our Mission
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/85">
            Your donation funds life-changing SRHR programmes, mental health services, and youth empowerment initiatives in Siaya County.
          </p>
          <nav aria-label="Breadcrumb" className="mt-6 flex items-center justify-center gap-2 text-sm text-white/70">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/get-involved" className="hover:text-white transition-colors">Get Involved</Link>
            <span aria-hidden="true">/</span>
            <span className="text-white" aria-current="page">Donate</span>
          </nav>
        </div>
      </section>

      <section className="py-20 lg:py-28" aria-labelledby="donate-content-heading">
        <div className="container-site grid gap-14 lg:grid-cols-2 lg:gap-20">

          {/* Donation form */}
          <div>
            <h2 id="donate-content-heading" className="font-display text-2xl font-bold text-neutral-900">
              Make a Donation
            </h2>
            <p className="mt-2 text-base text-neutral-600">
              M-Pesa integration coming soon. In the meantime, please contact us directly to make a donation.
            </p>

            <div className="mt-8 rounded-2xl bg-accent-50 p-8 ring-1 ring-accent-100">
              <h3 className="font-display text-lg font-bold text-neutral-900">Bank Transfer</h3>
              <div className="mt-4 space-y-3 text-sm text-neutral-600">
                <div className="flex justify-between border-b border-accent-100 pb-2">
                  <span className="font-medium text-neutral-700">Account Name</span>
                  <span>{ORG.name}</span>
                </div>
                <div className="flex justify-between border-b border-accent-100 pb-2">
                  <span className="font-medium text-neutral-700">Bank</span>
                  <span>Equity Bank Kenya</span>
                </div>
                <div className="flex justify-between border-b border-accent-100 pb-2">
                  <span className="font-medium text-neutral-700">Branch</span>
                  <span>Bondo Branch</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-neutral-700">Account Number</span>
                  <span>Contact us for details</span>
                </div>
              </div>
              <Link
                href={ROUTES.contact}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent-500 px-6 py-3.5 text-sm font-bold text-white shadow-amber transition-colors hover:bg-accent-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2"
              >
                Contact Us to Donate <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>

            <div className="mt-6 rounded-2xl bg-primary-50 p-6 ring-1 ring-primary-100">
              <p className="text-sm font-semibold text-neutral-700">M-Pesa Donations</p>
              <p className="mt-1 text-sm text-neutral-500">
                We are integrating M-Pesa Daraja 2.0 for seamless mobile donations. Coming soon — contact us to donate via M-Pesa in the meantime.
              </p>
            </div>
          </div>

          {/* Impact */}
          <div>
            <h2 className="font-display text-2xl font-bold text-neutral-900">Your Impact</h2>
            <p className="mt-2 text-base text-neutral-600">
              Every contribution — no matter the size — makes a real difference in the lives of communities in Siaya County.
            </p>
            <ul className="mt-8 space-y-4" role="list">
              {IMPACT.map((item) => (
                <li key={item.amount} className="flex items-start gap-4 rounded-2xl bg-neutral-50 p-5 ring-1 ring-neutral-200">
                  <div className="flex h-12 w-20 shrink-0 items-center justify-center rounded-xl bg-accent-500 text-sm font-extrabold text-white">
                    {item.amount}
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="shrink-0 text-success-500" aria-hidden="true" />
                    <p className="text-sm text-neutral-700">{item.impact}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
