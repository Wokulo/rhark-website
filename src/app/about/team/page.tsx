import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import Link from "next/link";
import { Mail, Linkedin, Twitter } from "lucide-react";
import { teamData } from "@/data/team";
import { ROUTES } from "@/constants";

export const metadata: Metadata = buildMetadata({
  title: "Our Team",
  description: "Meet the dedicated team behind RHARK — the people driving health, rights, and empowerment in Siaya County, Kenya.",
  path: "/about/team",
});

export default function TeamPage() {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 py-24 lg:py-32" aria-labelledby="team-hero-heading">
        <div className="container-site text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-primary-200">Our People</p>
          <h1 id="team-hero-heading" className="mt-3 font-display text-4xl font-extrabold text-white text-balance lg:text-5xl">
            Meet Our Team
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-primary-200">
            Passionate professionals and community advocates driving RHARK's mission every day.
          </p>
          <nav aria-label="Breadcrumb" className="mt-6 flex items-center justify-center gap-2 text-sm text-primary-300">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href={ROUTES.about} className="hover:text-white transition-colors">About</Link>
            <span aria-hidden="true">/</span>
            <span className="text-white" aria-current="page">Team</span>
          </nav>
        </div>
      </section>

      <section className="py-20 lg:py-28" aria-labelledby="team-list-heading">
        <div className="container-site">
          <h2 id="team-list-heading" className="sr-only">Team Members</h2>
          {teamData.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {teamData.map((member) => (
                <article key={member.id} className="group rounded-2xl bg-neutral-50 p-6 ring-1 ring-neutral-200 transition-all duration-250 hover:shadow-lg hover:ring-neutral-300">
                  <div className="mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-primary-100">
                    <span className="font-display text-2xl font-extrabold text-primary-500">
                      {member.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </span>
                  </div>
                  <h3 className="font-display text-base font-bold text-neutral-900">{member.name}</h3>
                  <p className="mt-0.5 text-sm font-medium text-primary-600">{member.title}</p>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-500">{member.bio}</p>
                  <div className="mt-4 flex items-center gap-2">
                    {member.email && (
                      <a href={`mailto:${member.email}`} aria-label={`Email ${member.name}`} className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-200 text-neutral-500 transition-colors hover:bg-primary-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500">
                        <Mail size={14} aria-hidden="true" />
                      </a>
                    )}
                    {member.linkedin && (
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} on LinkedIn`} className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-200 text-neutral-500 transition-colors hover:bg-primary-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500">
                        <Linkedin size={14} aria-hidden="true" />
                      </a>
                    )}
                    {member.twitter && (
                      <a href={member.twitter} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} on Twitter`} className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-200 text-neutral-500 transition-colors hover:bg-primary-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500">
                        <Twitter size={14} aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-neutral-500">Team profiles coming soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* Join CTA */}
      <section className="bg-primary-50 py-16" aria-labelledby="join-team-heading">
        <div className="container-site text-center">
          <h2 id="join-team-heading" className="font-display text-2xl font-extrabold text-neutral-900">
            Want to join our team?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-base text-neutral-600">
            We are always looking for passionate individuals to join our volunteer network or apply for internship opportunities.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href={ROUTES.volunteer} className="inline-flex items-center gap-2 rounded-full bg-primary-500 px-6 py-3 text-sm font-bold text-white shadow-teal-sm transition-all duration-200 hover:bg-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2">
              Volunteer with Us
            </Link>
            <Link href={ROUTES.internship} className="inline-flex items-center gap-2 rounded-full border-2 border-primary-500 px-6 py-3 text-sm font-bold text-primary-600 transition-all duration-200 hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2">
              Apply for Internship
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
