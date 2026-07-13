import type { Metadata } from "next";
import Link from "next/link";
import { Camera, Mail, Megaphone } from "lucide-react";
import { buildMetadata } from "@/lib/metadata";
import { ORG } from "@/constants";

export const metadata: Metadata = buildMetadata({
  title: "Media Centre",
  description:
    "RHARK media centre for press contacts, organization profile, news, images, and official announcements.",
  path: "/media-centre",
});

export default function MediaCentrePage() {
  return (
    <div className="bg-white">
      <section className="bg-primary-700 py-24 text-white lg:py-32">
        <div className="container-site max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-widest text-primary-200">
            Media Centre
          </p>
          <h1 className="mt-3 font-display text-4xl font-extrabold lg:text-5xl">
            Press and media resources
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-primary-100">
            A central place for RHARK announcements, media contacts, approved
            profile information, and downloadable media assets.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container-site grid gap-6 md:grid-cols-3">
          <Link href="/news" className="rounded-2xl bg-neutral-50 p-6 ring-1 ring-neutral-200 transition hover:shadow-lg">
            <Megaphone className="text-primary-600" size={24} aria-hidden="true" />
            <h2 className="mt-4 font-display text-xl font-bold text-neutral-900">Latest news</h2>
            <p className="mt-2 text-sm text-neutral-500">Official updates and public announcements.</p>
          </Link>
          <Link href="/resources" className="rounded-2xl bg-neutral-50 p-6 ring-1 ring-neutral-200 transition hover:shadow-lg">
            <Camera className="text-primary-600" size={24} aria-hidden="true" />
            <h2 className="mt-4 font-display text-xl font-bold text-neutral-900">Media kit</h2>
            <p className="mt-2 text-sm text-neutral-500">Prepared area for logos, images, and profile PDFs.</p>
          </Link>
          <a href={`mailto:${ORG.email}`} className="rounded-2xl bg-neutral-50 p-6 ring-1 ring-neutral-200 transition hover:shadow-lg">
            <Mail className="text-primary-600" size={24} aria-hidden="true" />
            <h2 className="mt-4 font-display text-xl font-bold text-neutral-900">Press contact</h2>
            <p className="mt-2 text-sm text-neutral-500">{ORG.email}</p>
          </a>
        </div>
      </section>
    </div>
  );
}
