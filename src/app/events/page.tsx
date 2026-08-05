import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import Link from "next/link";
import { Calendar, MapPin, ArrowRight, Monitor } from "lucide-react";
import { ROUTES } from "@/constants";

export const metadata: Metadata = buildMetadata({
  title: "Events",
  description: "Upcoming and past events from RHARK — workshops, webinars, community forums, and training programmes in Siaya County, Kenya.",
  path: "/events",
});

const EVENTS = [
  { title: "SRHR Community Dialogue — Bondo Town", type: "Community Forum", date: "28 February 2025", time: "9:00 AM – 1:00 PM EAT", location: "Bondo Community Hall, Siaya County", isVirtual: false, description: "A community dialogue bringing together youth, women, community leaders, and health workers to discuss SRHR challenges and solutions in Bondo Sub-County.", tag: "SRHR", tagColor: "bg-primary-100 text-primary-700" },
  { title: "Mental Health First Aid Training for Teachers", type: "Training", date: "14 March 2025", time: "8:00 AM – 5:00 PM EAT", location: "RHARK Head Office, Bondo Town", isVirtual: false, description: "A one-day training equipping secondary school teachers with mental health first aid skills to support students experiencing psychosocial challenges.", tag: "Mental Health", tagColor: "bg-secondary-100 text-secondary-600" },
  { title: "Gender Equality Webinar: Engaging Men and Boys", type: "Webinar", date: "21 March 2025", time: "2:00 PM – 4:00 PM EAT", location: "Online (Zoom)", isVirtual: true, description: "An online discussion on strategies for engaging men and boys as champions of gender equality and GBV prevention in Siaya County.", tag: "Gender Equality", tagColor: "bg-accent-100 text-accent-700" },
  { title: "Annual RHARK Partners Forum 2025", type: "Conference", date: "10 April 2025", time: "9:00 AM – 5:00 PM EAT", location: "Siaya County Conference Centre", isVirtual: false, description: "Our annual gathering of partners, funders, government officials, and community stakeholders to review progress and plan for the year ahead.", tag: "Governance", tagColor: "bg-info-50 text-info-600" },
];

export default function EventsPage() {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 py-24 lg:py-32" aria-labelledby="events-hero-heading">
        <div className="container-site text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-primary-200">What's On</p>
          <h1 id="events-hero-heading" className="mt-3 font-display text-4xl font-extrabold text-white text-balance lg:text-5xl">
            Events
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-primary-200">
            Workshops, webinars, community forums, and training programmes from RHARK.
          </p>
          <nav aria-label="Breadcrumb" className="mt-6 flex items-center justify-center gap-2 text-sm text-primary-300">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span aria-hidden="true">/</span>
            <span className="text-white" aria-current="page">Events</span>
          </nav>
        </div>
      </section>

      <section className="py-20 lg:py-28" aria-labelledby="events-list-heading">
        <div className="container-site">
          <h2 id="events-list-heading" className="mb-10 font-display text-2xl font-bold text-neutral-900">
            Upcoming Events
          </h2>
          <div className="space-y-6">
            {EVENTS.map((event) => (
              <article
                key={event.title}
                className="group flex flex-col gap-6 rounded-2xl bg-neutral-50 p-6 ring-1 ring-neutral-200 transition-all duration-250 hover:shadow-lg hover:ring-neutral-300 sm:flex-row sm:items-start"
              >
                {/* Date block */}
                <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-2xl bg-primary-500 text-white">
                  <span className="text-2xl font-extrabold leading-none">
                    {event.date.split(" ")[0]}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wide">
                    {event.date.split(" ")[1]}
                  </span>
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${event.tagColor}`}>
                      {event.type}
                    </span>
                    {event.isVirtual && (
                      <span className="flex items-center gap-1 rounded-full bg-info-50 px-3 py-1 text-xs font-bold text-info-600">
                        <Monitor size={11} aria-hidden="true" /> Online
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2 font-display text-lg font-bold text-neutral-900 group-hover:text-primary-600 transition-colors duration-150">
                    {event.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-500">{event.description}</p>
                  <div className="mt-3 flex flex-wrap gap-4 text-xs text-neutral-500">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={12} aria-hidden="true" />
                      {event.date} · {event.time}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={12} aria-hidden="true" />
                      {event.location}
                    </span>
                  </div>
                </div>

                <div className="shrink-0">
                  <Link
                    href={ROUTES.contact}
                    className="inline-flex items-center gap-2 rounded-full bg-primary-500 px-5 py-2.5 text-sm font-bold text-white shadow-teal-sm transition-all duration-200 hover:bg-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                  >
                    Register <ArrowRight size={13} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
