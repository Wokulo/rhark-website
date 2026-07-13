import type { Metadata } from "next";
import Link from "next/link";
import { Handshake, Mail, Send } from "lucide-react";
import { buildMetadata } from "@/lib/metadata";
import { ORG } from "@/constants";

export const metadata: Metadata = buildMetadata({
  title: "Partner With Us",
  description:
    "Partner with RHARK to advance SRHR, youth empowerment, mental health, gender equality, governance, and climate justice in Kenya.",
  path: "/get-involved/partner",
});

export default function PartnerPage() {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 py-24 text-white lg:py-32">
        <div className="container-site max-w-4xl text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
            <Handshake size={30} aria-hidden="true" />
          </div>
          <h1 className="font-display text-4xl font-extrabold lg:text-5xl">
            Partner With RHARK
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-primary-100">
            Collaborate with RHARK on community health, rights, advocacy,
            research, service referrals, and youth-led action.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container-site grid gap-10 lg:grid-cols-3">
          <aside className="rounded-2xl bg-primary-50 p-6 ring-1 ring-primary-100">
            <h2 className="font-display text-xl font-bold text-neutral-900">Partnership areas</h2>
            <ul className="mt-4 space-y-3 text-sm text-neutral-600" role="list">
              <li>Programme implementation</li>
              <li>Funding and grant partnerships</li>
              <li>Government and policy engagement</li>
              <li>Research, learning, and publications</li>
              <li>Media and community campaigns</li>
            </ul>
          </aside>

          <div className="lg:col-span-2 rounded-2xl bg-neutral-50 p-6 ring-1 ring-neutral-200">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary-500">
              Partnership inquiry
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold text-neutral-900">
              Start a collaboration conversation
            </h2>
            <p className="mt-3 text-neutral-600">
              A full partnership form schema is prepared in the validation layer.
              Until the API endpoint is connected, partners can contact RHARK
              directly by email.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={`mailto:${ORG.email}?subject=Partnership inquiry`}
                className="inline-flex items-center gap-2 rounded-full bg-primary-500 px-6 py-3 text-sm font-bold text-white shadow-teal-sm transition hover:bg-primary-600"
              >
                <Mail size={16} aria-hidden="true" />
                Email RHARK
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border-2 border-primary-500 px-6 py-3 text-sm font-bold text-primary-600 transition hover:bg-primary-50"
              >
                <Send size={16} aria-hidden="true" />
                Use contact form
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
