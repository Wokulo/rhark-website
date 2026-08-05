import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import Link from "next/link";
import { ArrowRight, Handshake, Heart, BookOpen, Users } from "lucide-react";
import { ROUTES } from "@/constants";

export const metadata: Metadata = buildMetadata({
  title: "Get Involved",
  description: "Get involved with RHARK — volunteer, partner with us, donate, or apply for an internship to advance health and rights in Siaya County, Kenya.",
  path: "/get-involved",
});

const OPTIONS = [
  {
    icon: Users,
    title: "Volunteer",
    description: "Join our network of passionate volunteers and contribute your skills to advancing health and rights in Kenya.",
    href: ROUTES.volunteer,
    color: "bg-primary-500",
    lightBg: "bg-primary-50",
    textColor: "text-primary-600",
  },
  {
    icon: Handshake,
    title: "Partner With Us",
    description: "Collaborate with RHARK on community health, rights, advocacy, research, service referrals, and youth-led action.",
    href: ROUTES.partner,
    color: "bg-secondary-400",
    lightBg: "bg-secondary-50",
    textColor: "text-secondary-500",
  },
  {
    icon: Heart,
    title: "Donate",
    description: "Your donation funds life-changing SRHR programmes, mental health services, and youth empowerment initiatives in Siaya County.",
    href: ROUTES.donate,
    color: "bg-accent-500",
    lightBg: "bg-accent-50",
    textColor: "text-accent-600",
  },
  {
    icon: BookOpen,
    title: "Internships",
    description: "Gain hands-on experience in public health, gender, advocacy, and community development with a leading Kenyan CBO.",
    href: ROUTES.internship,
    color: "bg-info-500",
    lightBg: "bg-info-50",
    textColor: "text-info-600",
  },
];

export default function GetInvolvedPage() {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 py-24 lg:py-32" aria-labelledby="get-involved-hero-heading">
        <div className="container-site text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-primary-200">Get Involved</p>
          <h1 id="get-involved-hero-heading" className="mt-3 font-display text-4xl font-extrabold text-white text-balance lg:text-5xl">
            Be part of the change
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-primary-200">
            Whether you volunteer, partner, donate, or intern, your involvement helps RHARK advance health and rights in Siaya County and beyond.
          </p>
          <nav aria-label="Breadcrumb" className="mt-6 flex items-center justify-center gap-2 text-sm text-primary-300">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span aria-hidden="true">/</span>
            <span className="text-white" aria-current="page">Get Involved</span>
          </nav>
        </div>
      </section>

      <section className="py-16 lg:py-20" aria-labelledby="get-involved-list-heading">
        <div className="container-site">
          <h2 id="get-involved-list-heading" className="sr-only">Ways to Get Involved</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {OPTIONS.map((option) => (
              <Link
                key={option.href}
                href={option.href}
                className="group flex flex-col rounded-[1.6rem] bg-neutral-50 p-6 ring-1 ring-neutral-200 transition-all duration-250 hover:shadow-lg hover:ring-neutral-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${option.color}`}>
                  <option.icon size={26} className="text-white" aria-hidden="true" />
                </div>
                <h3 className="font-display text-xl font-bold text-neutral-900 group-hover:text-primary-600 transition-colors duration-150">
                  {option.title}
                </h3>
                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-neutral-500">{option.description}</p>
                <div className={`mt-4 flex items-center gap-1.5 text-sm font-semibold ${option.textColor}`}>
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
