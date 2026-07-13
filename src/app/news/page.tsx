import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import Link from "next/link";
import { Clock, ArrowRight, Tag } from "lucide-react";
import { ROUTES } from "@/constants";

export const metadata: Metadata = buildMetadata({
  title: "News & Blog",
  description: "Latest news, press releases, blog posts, and success stories from RHARK — advancing health and rights in Siaya County, Kenya.",
  path: "/news",
});

const ARTICLES = [
  { title: "RHARK Launches New SRHR Awareness Campaign in Bondo Sub-County", excerpt: "RHARK has launched a comprehensive SRHR awareness campaign targeting over 2,000 youth in Bondo Sub-County, focusing on family planning, HIV prevention, and gender-based violence.", category: "News", date: "15 January 2025", readTime: "3 min read", tag: "SRHR", tagColor: "bg-primary-100 text-primary-700" },
  { title: "Community Health Volunteers Trained in Maternal Health Support", excerpt: "Forty community health volunteers from across Siaya County completed a five-day training on maternal and newborn health, equipping them to support pregnant women in their communities.", category: "Press Release", date: "8 January 2025", readTime: "4 min read", tag: "Maternal Health", tagColor: "bg-accent-100 text-accent-700" },
  { title: "RHARK Partners with County Government on Mental Health Policy", excerpt: "RHARK has entered into a memorandum of understanding with the Siaya County Government to co-develop a county-level mental health policy framework for youth and adolescents.", category: "Announcement", date: "2 January 2025", readTime: "2 min read", tag: "Mental Health", tagColor: "bg-secondary-100 text-secondary-600" },
  { title: "Youth Champions Complete Gender Equality Training Programme", excerpt: "Sixty young people from Siaya County graduated from RHARK's Youth Gender Champions programme, equipped with skills to challenge harmful gender norms in their communities.", category: "Success Story", date: "20 December 2024", readTime: "5 min read", tag: "Gender Equality", tagColor: "bg-success-50 text-success-600" },
  { title: "RHARK Annual Report 2024 Now Available", excerpt: "Our 2024 Annual Report documents the impact of our programmes, financial accountability, and strategic direction for 2025. Download your copy from our Publications page.", category: "Announcement", date: "10 December 2024", readTime: "1 min read", tag: "Publications", tagColor: "bg-info-50 text-info-600" },
  { title: "Climate Justice Workshop Brings Together 150 Community Members", excerpt: "RHARK hosted a two-day climate justice workshop in Bondo Town, bringing together community members, local government officials, and development partners to discuss climate resilience strategies.", category: "News", date: "1 December 2024", readTime: "3 min read", tag: "Climate Justice", tagColor: "bg-success-50 text-success-600" },
];

const CATEGORIES = ["All", "News", "Press Release", "Blog", "Success Story", "Announcement"];

export default function NewsPage() {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 py-24 lg:py-32" aria-labelledby="news-hero-heading">
        <div className="container-site text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-primary-200">Media Centre</p>
          <h1 id="news-hero-heading" className="mt-3 font-display text-4xl font-extrabold text-white text-balance lg:text-5xl">
            News &amp; Blog
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-primary-200">
            Latest updates, stories, and announcements from RHARK.
          </p>
          <nav aria-label="Breadcrumb" className="mt-6 flex items-center justify-center gap-2 text-sm text-primary-300">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span aria-hidden="true">/</span>
            <span className="text-white" aria-current="page">News</span>
          </nav>
        </div>
      </section>

      <section className="py-20 lg:py-28" aria-labelledby="news-list-heading">
        <div className="container-site">
          {/* Category filter — static for now */}
          <div className="mb-10 flex flex-wrap gap-2" role="list" aria-label="Filter by category">
            {CATEGORIES.map((cat, i) => (
              <span
                key={cat}
                role="listitem"
                className={`rounded-full px-4 py-2 text-sm font-semibold cursor-default ${i === 0 ? "bg-primary-500 text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"}`}
              >
                {cat}
              </span>
            ))}
          </div>

          <h2 id="news-list-heading" className="sr-only">All Articles</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {ARTICLES.map((article) => (
              <article
                key={article.title}
                className="group flex flex-col rounded-2xl bg-neutral-50 ring-1 ring-neutral-200 transition-all duration-250 hover:shadow-lg hover:ring-neutral-300"
              >
                <div className="relative h-48 overflow-hidden rounded-t-2xl bg-gradient-to-br from-primary-100 to-primary-200">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Tag size={40} className="text-primary-300" aria-hidden="true" />
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center justify-between">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${article.tagColor}`}>
                      {article.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-neutral-400">
                      <Clock size={11} aria-hidden="true" /> {article.readTime}
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-base font-bold leading-snug text-neutral-900 group-hover:text-primary-600 transition-colors duration-150">
                    {article.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-500 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-4">
                    <time className="text-xs text-neutral-400">{article.date}</time>
                    <Link
                      href={ROUTES.news}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
                    >
                      Read <ArrowRight size={13} aria-hidden="true" className="transition-transform duration-150 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
