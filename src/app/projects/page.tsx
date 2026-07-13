import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Users, ArrowRight, CheckCircle2 } from "lucide-react";
import { projectsData } from "@/data/projects";
import { ROUTES } from "@/constants";

export const metadata: Metadata = buildMetadata({
  title: "Our Projects",
  description: "Explore RHARK's community-led projects advancing SRHR, maternal health, mental health, and gender equality in Siaya County, Kenya.",
  path: "/projects",
});

const STATUS_COLORS: Record<string, string> = {
  active: "bg-success-500 text-white",
  completed: "bg-neutral-400 text-white",
  upcoming: "bg-accent-500 text-white",
};

export default function ProjectsPage() {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 py-24 lg:py-32" aria-labelledby="projects-hero-heading">
        <div className="container-site text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-primary-200">Our Work</p>
          <h1 id="projects-hero-heading" className="mt-3 font-display text-4xl font-extrabold text-white text-balance lg:text-5xl">
            Projects
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-primary-200">
            Community-led initiatives transforming lives across Siaya County and beyond.
          </p>
          <nav aria-label="Breadcrumb" className="mt-6 flex items-center justify-center gap-2 text-sm text-primary-300">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span aria-hidden="true">/</span>
            <span className="text-white" aria-current="page">Projects</span>
          </nav>
        </div>
      </section>

      <section className="py-20 lg:py-28" aria-labelledby="projects-list-heading">
        <div className="container-site">
          <h2 id="projects-list-heading" className="sr-only">All Projects</h2>
          {projectsData.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {projectsData.map((project) => (
                <article
                  key={project.id}
                  className="group flex flex-col overflow-hidden rounded-2xl bg-neutral-50 ring-1 ring-neutral-200 transition-all duration-250 hover:shadow-lg hover:ring-neutral-300"
                >
                  <div className="relative h-52 overflow-hidden bg-neutral-200">
                    <div className="absolute inset-0 flex items-center justify-center bg-primary-100">
                      <span className="font-display text-4xl font-extrabold text-primary-300">
                        {project.title.charAt(0)}
                      </span>
                    </div>
                    <span className={`absolute right-4 top-4 rounded-full px-2.5 py-1 text-xs font-bold capitalize ${STATUS_COLORS[project.status] ?? "bg-neutral-400 text-white"}`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display text-lg font-bold text-neutral-900 group-hover:text-primary-600 transition-colors duration-150">
                      {project.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-500">{project.summary}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-4">
                      <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                        <MapPin size={12} aria-hidden="true" />
                        {project.location}
                      </div>
                      {project.beneficiariesCount && (
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-primary-600">
                          <Users size={12} aria-hidden="true" />
                          {project.beneficiariesCount.toLocaleString()}+
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-neutral-500">Project profiles coming soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-50 py-16" aria-labelledby="projects-cta-heading">
        <div className="container-site text-center">
          <h2 id="projects-cta-heading" className="font-display text-2xl font-extrabold text-neutral-900">
            Want to support our projects?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-base text-neutral-600">
            Your donation directly funds community projects that change lives in communities accross Siaya County. Join us in making a difference today.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href={ROUTES.donate} className="inline-flex items-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-amber transition-all duration-200 hover:bg-accent-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2">
              Donate Now <ArrowRight size={14} aria-hidden="true" />
            </Link>
            <Link href={ROUTES.volunteer} className="inline-flex items-center gap-2 rounded-full border-2 border-primary-500 px-6 py-3 text-sm font-bold text-primary-600 transition-all duration-200 hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2">
              Volunteer with Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
