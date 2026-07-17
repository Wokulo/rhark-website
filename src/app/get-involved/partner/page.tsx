import type { Metadata } from "next";
import Link from "next/link";
import { Handshake, CheckCircle2 } from "lucide-react";
import { buildMetadata } from "@/lib/metadata";
import { ORG } from "@/constants";
import PartnerForm from "./partner-form";

export const metadata: Metadata = buildMetadata({
  title: "Partner With Us",
  description:
    "Partner with RHARK to advance SRHR, youth empowerment, mental health, gender equality, governance, and climate justice in Kenya.",
  path: "/get-involved/partner",
});

const PARTNERSHIP_TYPES = ["Funding & Grant", "Programme Implementation", "Government & Policy", "Research & Learning", "Media & Communications", "Corporate Social Responsibility"];

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
        <div className="container-site grid gap-10 lg:grid-cols-3 lg:gap-20">
          <aside className="space-y-6">
            <div className="rounded-2xl bg-primary-50 p-6 ring-1 ring-primary-100">
              <h2 className="font-display text-xl font-bold text-neutral-900">Partnership areas</h2>
              <ul className="mt-4 space-y-3 text-sm text-neutral-600" role="list">
                {["Programme implementation", "Funding and grant partnerships", "Government and policy engagement", "Research, learning, and publications", "Media and community campaigns"].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-primary-500" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-neutral-50 p-6 ring-1 ring-neutral-200">
              <h3 className="font-display text-base font-bold text-neutral-900">Contact Us Directly</h3>
              <div className="mt-3 space-y-2 text-sm text-neutral-600">
                <p>Email: <a href={`mailto:${ORG.email}`} className="text-primary-600 hover:underline">{ORG.email}</a></p>
                <p>Phone: <a href={`tel:${ORG.phone}`} className="text-primary-600 hover:underline">{ORG.phone}</a></p>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-2">
            <PartnerForm />
          </div>
        </div>
      </section>
    </div>
  );
}
