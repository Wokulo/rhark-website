import type { Metadata } from "next";
import Link from "next/link";
import { Download, FileText, Newspaper } from "lucide-react";
import { buildMetadata } from "@/lib/metadata";
import { getDownloads } from "@/services/cms";

export const metadata: Metadata = buildMetadata({
  title: "Resources",
  description:
    "RHARK resources, downloads, toolkits, media kits, and practical documents for partners and communities.",
  path: "/resources",
});

export default async function ResourcesPage() {
  const downloads = await getDownloads();

  return (
    <div className="bg-white">
      <section className="bg-neutral-900 py-24 text-white lg:py-32">
        <div className="container-site max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-widest text-primary-300">
            Resources
          </p>
          <h1 className="mt-3 font-display text-4xl font-extrabold lg:text-5xl">
            Practical RHARK materials
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-neutral-300">
            A prepared home for downloads, toolkits, reports, forms, and media
            files that can later be managed from a CMS.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container-site grid gap-6 md:grid-cols-3">
          <Link href="/publications" className="rounded-2xl bg-neutral-50 p-6 ring-1 ring-neutral-200 transition hover:shadow-lg">
            <FileText className="text-primary-600" size={24} aria-hidden="true" />
            <h2 className="mt-4 font-display text-xl font-bold text-neutral-900">Publications</h2>
            <p className="mt-2 text-sm text-neutral-500">Reports, research, briefs, and newsletters.</p>
          </Link>
          <Link href="/news" className="rounded-2xl bg-neutral-50 p-6 ring-1 ring-neutral-200 transition hover:shadow-lg">
            <Newspaper className="text-primary-600" size={24} aria-hidden="true" />
            <h2 className="mt-4 font-display text-xl font-bold text-neutral-900">News</h2>
            <p className="mt-2 text-sm text-neutral-500">Updates, announcements, and stories.</p>
          </Link>
          <div className="rounded-2xl bg-neutral-50 p-6 ring-1 ring-neutral-200">
            <Download className="text-primary-600" size={24} aria-hidden="true" />
            <h2 className="mt-4 font-display text-xl font-bold text-neutral-900">Downloads</h2>
            <p className="mt-2 text-sm text-neutral-500">CMS-ready downloadable resources.</p>
          </div>
        </div>

        <div className="container-site mt-10">
          <h2 className="font-display text-2xl font-bold text-neutral-900">Available downloads</h2>
          <div className="mt-6 grid gap-4">
            {downloads.map((item) => (
              <article key={item.id} className="rounded-2xl bg-white p-5 ring-1 ring-neutral-200">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary-500">{item.type}</p>
                <h3 className="mt-2 font-semibold text-neutral-900">{item.title}</h3>
                <p className="mt-1 text-sm text-neutral-500">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
