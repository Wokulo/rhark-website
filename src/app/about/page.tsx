import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Target, Eye } from "lucide-react";
import { ORG, CORE_VALUES, ROUTES } from "@/constants";

export const metadata: Metadata = buildMetadata({
  title: "About Us",
  description: "Learn about RHARK — our story, vision, mission, and the values that guide our work in Siaya County, Kenya.",
  path: "/about",
});

const STRATEGIC_AREAS = [
  "Sexual and Reproductive Health and Rights (SRHR)",
  "Mental Health and Wellness",
  "HIV/AIDS and Teen Pregnancy Prevention",
  "Gender Equality and Empowerment",
  "Governance and Policy Engagement",
  "Climate Justice",
];

const BENEFICIARIES = [
  "Youth", "Adolescents", "Women and Girls", "Persons with Disabilities",
  "Rural Communities", "Community Leaders", "Government Institutions",
  "Development Partners", "Researchers", "Volunteers", "Healthcare Professionals",
];

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 py-24 lg:py-32" aria-labelledby="about-hero-heading">
        <div className="container-site text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-primary-200">About RHARK</p>
          <h1 id="about-hero-heading" className="mt-3 font-display text-4xl font-extrabold text-white text-balance lg:text-5xl">
            Who We Are
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-primary-200">
            {ORG.name} is a community-based organization established in {ORG.founded}, dedicated to advancing health, rights, and empowerment across {ORG.county} and beyond.
          </p>
          <nav aria-label="About page breadcrumb" className="mt-6 flex items-center justify-center gap-2 text-sm text-primary-300">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span aria-hidden="true">/</span>
            <span className="text-white" aria-current="page">About</span>
          </nav>
        </div>
      </section>

      {/* Story + Image */}
      <section className="py-20 lg:py-28" aria-labelledby="story-heading">
        <div className="container-site grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-primary-500">Our Story</p>
            <h2 id="story-heading" className="mt-2 font-display text-3xl font-extrabold text-neutral-900 text-balance lg:text-4xl">
              Born from community need
            </h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-neutral-600">
              <p>
                RHARK was established in {ORG.founded} in response to the persistent unmet needs in Sexual and Reproductive Health and Rights among young people and women in {ORG.county}. Founded by a group of passionate community health advocates, RHARK has grown from a grassroots initiative into a recognized community-based organization.
              </p>
              <p>
                Operating from our head office at {ORG.address}, we work directly with communities, government institutions, and development partners to deliver evidence-based programs that transform lives.
              </p>
              <p>
                Our approach is rooted in community participation, intersectionality, and a deep respect for the rights and dignity of every individual we serve.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={ROUTES.team} className="inline-flex items-center gap-2 rounded-full bg-primary-500 px-6 py-3 text-sm font-bold text-white shadow-teal-sm transition-all duration-200 hover:bg-primary-600 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2">
                Meet Our Team <ArrowRight size={15} aria-hidden="true" />
              </Link>
              <Link href={ROUTES.contact} className="inline-flex items-center gap-2 rounded-full border-2 border-neutral-200 px-6 py-3 text-sm font-bold text-neutral-700 transition-all duration-200 hover:border-primary-300 hover:text-primary-600 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2">
                Contact Us
              </Link>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[2rem] shadow-2xl">
            <div className="relative aspect-[4/3] bg-primary-100">
              <Image
                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=85"
                alt="RHARK community health workers and beneficiaries in Siaya County, Kenya"
                fill className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="bg-neutral-50 py-20 lg:py-24" aria-labelledby="vision-mission-heading">
        <div className="container-site">
          <h2 id="vision-mission-heading" className="sr-only">Vision and Mission</h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-neutral-200">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50">
                <Eye size={22} className="text-primary-500" aria-hidden="true" />
              </div>
              <h3 className="font-display text-xl font-bold text-neutral-900">Our Vision</h3>
              <p className="mt-3 text-base leading-relaxed text-neutral-600">{ORG.vision}</p>
            </div>
            <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-neutral-200">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-50">
                <Target size={22} className="text-accent-600" aria-hidden="true" />
              </div>
              <h3 className="font-display text-xl font-bold text-neutral-900">Our Mission</h3>
              <p className="mt-3 text-base leading-relaxed text-neutral-600">{ORG.mission}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section id="values" className="py-20 lg:py-24" aria-labelledby="values-heading">
        <div className="container-site">
          <div className="mb-12 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-primary-500">What Guides Us</p>
            <h2 id="values-heading" className="mt-2 font-display text-3xl font-extrabold text-neutral-900 lg:text-4xl">Core Values</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CORE_VALUES.map((value) => (
              <div key={value.title} className="rounded-2xl bg-neutral-50 p-6 ring-1 ring-neutral-200">
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100">
                  <CheckCircle2 size={16} className="text-primary-600" aria-hidden="true" />
                </div>
                <h3 className="font-display text-base font-bold text-neutral-900">{value.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-500">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Strategic Areas */}
      <section className="bg-neutral-50 py-20 lg:py-24" aria-labelledby="strategic-heading">
        <div className="container-site grid gap-14 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-primary-500">What We Do</p>
            <h2 id="strategic-heading" className="mt-2 font-display text-3xl font-extrabold text-neutral-900 text-balance lg:text-4xl">
              Strategic Programme Areas
            </h2>
            <p className="mt-4 text-base leading-relaxed text-neutral-600">
              Our six strategic programme areas address the interconnected challenges facing communities in Siaya County and across Kenya.
            </p>
            <ul className="mt-6 space-y-3" role="list">
              {STRATEGIC_AREAS.map((area) => (
                <li key={area} className="flex items-center gap-3 text-sm text-neutral-700">
                  <CheckCircle2 size={16} className="shrink-0 text-primary-500" aria-hidden="true" />
                  {area}
                </li>
              ))}
            </ul>
            <Link href={ROUTES.programmes} className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary-500 px-6 py-3 text-sm font-bold text-white shadow-teal-sm transition-all duration-200 hover:bg-primary-600 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2">
              Explore Our Programs <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-primary-500">Who We Serve</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold text-neutral-900 text-balance lg:text-4xl">
              Target Beneficiaries
            </h2>
            <p className="mt-4 text-base leading-relaxed text-neutral-600">
              RHARK's programs are designed to reach the most vulnerable and underserved populations.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {BENEFICIARIES.map((b) => (
                <span key={b} className="rounded-full bg-white px-4 py-2 text-sm font-medium text-neutral-700 ring-1 ring-neutral-200">
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
