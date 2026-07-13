import type { Metadata } from "next";
import { Activity, BarChart3, CheckCircle2 } from "lucide-react";
import { buildMetadata } from "@/lib/metadata";
import { IMPACT_STATS } from "@/constants";

export const metadata: Metadata = buildMetadata({
  title: "Impact",
  description:
    "RHARK impact dashboard showing youth reached, women empowered, community dialogues, schools engaged, active projects, counties served, and partner organizations.",
  path: "/impact",
});

export default function ImpactPage() {
  return (
    <div className="bg-white">
      <section className="bg-primary-700 py-24 text-white lg:py-32">
        <div className="container-site max-w-4xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-primary-200">
            Impact Dashboard
          </p>
          <h1 className="mt-3 font-display text-4xl font-extrabold lg:text-5xl">
            Measuring community change
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-primary-100">
            Placeholder figures are centralized here so RHARK can replace them
            with verified monitoring and evaluation data before launch.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24" aria-labelledby="impact-metrics">
        <div className="container-site">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
              <BarChart3 size={22} aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-primary-500">
                Outcomes
              </p>
              <h2 id="impact-metrics" className="font-display text-2xl font-bold text-neutral-900">
                Key indicators
              </h2>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {IMPACT_STATS.map((stat) => (
              <article
                key={stat.id}
                className="rounded-2xl bg-neutral-50 p-6 ring-1 ring-neutral-200"
              >
                <Activity size={20} className="text-primary-500" aria-hidden="true" />
                <p className="mt-4 font-display text-4xl font-extrabold text-neutral-900">
                  {stat.value.toLocaleString()}
                  {stat.suffix}
                </p>
                <h3 className="mt-2 font-semibold text-neutral-900">{stat.label}</h3>
                {stat.description && (
                  <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                    {stat.description}
                  </p>
                )}
              </article>
            ))}
          </div>

          <div className="mt-10 rounded-2xl bg-primary-50 p-6 ring-1 ring-primary-100">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 shrink-0 text-primary-600" size={20} aria-hidden="true" />
              <p className="text-sm leading-relaxed text-neutral-700">
                Recommended next step: connect these indicators to RHARK's approved
                monitoring data source, then add time periods, locations, and
                programme filters.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
