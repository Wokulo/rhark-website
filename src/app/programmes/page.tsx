import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import Link from "next/link";
import { ArrowRight, Heart, Brain, Shield, Users, Landmark, Leaf } from "lucide-react";
import { ROUTES } from "@/constants";

export const metadata: Metadata = buildMetadata({
  title: "Our Programmes",
  description: "RHARK's six strategic programme areas advancing SRHR, mental health, gender equality, HIV prevention, governance, and climate justice in Kenya.",
  path: "/programmes",
});

const PROGRAMMES = [
  { icon: Heart, title: "Sexual & Reproductive Health and Rights", shortTitle: "SRHR", description: "Advancing access to comprehensive SRHR information, services, and rights for young people and women in Siaya County.", href: "/programmes/srhr", color: "bg-primary-500", lightBg: "bg-primary-50", textColor: "text-primary-600" },
  { icon: Brain, title: "Mental Health & Wellness", shortTitle: "Mental Health", description: "Promoting mental health awareness, reducing stigma, and connecting communities to psychosocial support services.", href: "/programmes/mental-health", color: "bg-secondary-400", lightBg: "bg-secondary-50", textColor: "text-secondary-500" },
  { icon: Shield, title: "HIV/AIDS & Teen Pregnancy Prevention", shortTitle: "HIV Prevention", description: "Comprehensive prevention programmes targeting adolescents to reduce HIV transmission and teenage pregnancy rates.", href: "/programmes/hiv-teen-pregnancy", color: "bg-accent-500", lightBg: "bg-accent-50", textColor: "text-accent-600" },
  { icon: Users, title: "Gender Equality & Empowerment", shortTitle: "Gender Equality", description: "Challenging harmful gender norms and empowering girls and women to participate fully in society.", href: "/programmes/gender-equality", color: "bg-primary-400", lightBg: "bg-primary-50", textColor: "text-primary-500" },
  { icon: Landmark, title: "Governance & Policy Engagement", shortTitle: "Governance", description: "Engaging policymakers to create enabling environments for SRHR and gender equality across Kenya.", href: "/programmes/governance-policy", color: "bg-info-500", lightBg: "bg-info-50", textColor: "text-info-600" },
  { icon: Leaf, title: "Climate Justice", shortTitle: "Climate Justice", description: "Addressing the intersection of climate change and reproductive health, building community resilience.", href: "/programmes/climate-justice", color: "bg-success-500", lightBg: "bg-success-50", textColor: "text-success-600" },
];

export default function ProgrammesPage() {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 py-24 lg:py-32" aria-labelledby="programmes-hero-heading">
        <div className="container-site text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-primary-200">What We Do</p>
          <h1 id="programmes-hero-heading" className="mt-3 font-display text-4xl font-extrabold text-white text-balance lg:text-5xl">
            Our Programmes
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-primary-200">
            Six strategic areas driving health, rights, and community transformation across Siaya County and Kenya.
          </p>
          <nav aria-label="Breadcrumb" className="mt-6 flex items-center justify-center gap-2 text-sm text-primary-300">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span aria-hidden="true">/</span>
            <span className="text-white" aria-current="page">Programmes</span>
          </nav>
        </div>
      </section>

      <section className="py-20 lg:py-28" aria-labelledby="programmes-list-heading">
        <div className="container-site">
          <h2 id="programmes-list-heading" className="sr-only">All Programmes</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {PROGRAMMES.map((prog) => (
              <Link
                key={prog.href}
                href={prog.href}
                className="group flex flex-col rounded-2xl bg-neutral-50 p-7 ring-1 ring-neutral-200 transition-all duration-250 hover:shadow-lg hover:ring-neutral-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                <div className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${prog.color}`}>
                  <prog.icon size={26} className="text-white" aria-hidden="true" />
                </div>
                <h3 className="font-display text-lg font-bold text-neutral-900 group-hover:text-primary-600 transition-colors duration-150">
                  {prog.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-neutral-500">{prog.description}</p>
                <div className={`mt-5 flex items-center gap-1.5 text-sm font-semibold ${prog.textColor}`}>
                  Learn more <ArrowRight size={14} aria-hidden="true" className="transition-transform duration-150 group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
