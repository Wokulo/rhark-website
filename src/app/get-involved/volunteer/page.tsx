"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Users, CheckCircle2, Send } from "lucide-react";
import { volunteerSchema, type VolunteerSchema } from "@/lib/validations";
import { cn } from "@/utils";

const COUNTIES = ["Siaya","Kisumu","Homa Bay","Migori","Kisii","Nyamira","Kakamega","Vihiga","Bungoma","Busia","Other"];
const AVAILABILITY = ["Weekdays (full-time)","Weekdays (part-time)","Weekends only","Flexible","Remote only"];
const SKILLS_OPTIONS = ["Community Health","Gender & SRHR","Mental Health","Research & Data","Communications","Fundraising","Legal & Advocacy","IT & Digital","Finance","Other"];

export default function VolunteerPage() {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<VolunteerSchema>({
    resolver: zodResolver(volunteerSchema),
  });

  const onSubmit = async (data: VolunteerSchema) => {
    try {
      const res = await fetch("/api/volunteer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to submit application");
      }
      setSubmitted(true);
      reset();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to submit application");
    }
  };

  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 py-24 lg:py-32" aria-labelledby="vol-hero-heading">
        <div className="container-site text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
            <Users size={30} className="text-white" aria-hidden="true" />
          </div>
          <h1 id="vol-hero-heading" className="font-display text-4xl font-extrabold text-white text-balance lg:text-5xl">
            Volunteer with RHARK
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-primary-200">
            Join our network of passionate volunteers and contribute your skills to advancing health and rights in Kenya.
          </p>
          <nav aria-label="Breadcrumb" className="mt-6 flex items-center justify-center gap-2 text-sm text-primary-300">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span aria-hidden="true">/</span>
            <span className="text-white" aria-current="page">Volunteer</span>
          </nav>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="container-site grid gap-14 lg:grid-cols-3 lg:gap-20">
          <aside className="space-y-6">
            <div className="rounded-2xl bg-primary-50 p-6 ring-1 ring-primary-100">
              <h2 className="font-display text-lg font-bold text-neutral-900">Why Volunteer?</h2>
              <ul className="mt-4 space-y-3" role="list">
                {["Make a real difference in communities","Gain hands-on experience in public health","Build your professional network","Receive training and capacity building","Get a reference letter upon completion"].map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-neutral-600">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-primary-500" aria-hidden="true" />{b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-neutral-50 p-6 ring-1 ring-neutral-200">
              <h3 className="font-display text-base font-bold text-neutral-900">Areas We Need Help</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {SKILLS_OPTIONS.map((s) => (
                  <span key={s} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-neutral-600 ring-1 ring-neutral-200">{s}</span>
                ))}
              </div>
            </div>
          </aside>

          <div className="lg:col-span-2">
            <h2 className="font-display text-2xl font-bold text-neutral-900">Volunteer Application</h2>
            {submitted ? (
              <div className="mt-8 flex flex-col items-center gap-4 rounded-2xl bg-success-50 p-10 text-center ring-1 ring-success-100">
                <CheckCircle2 size={48} className="text-success-500" aria-hidden="true" />
                <h3 className="font-display text-xl font-bold text-neutral-900">Application Received!</h3>
                <p className="max-w-sm text-neutral-600">Thank you for applying. We will review your application and get back to you within 5 business days.</p>
                <button onClick={() => setSubmitted(false)} className="mt-2 rounded-full bg-primary-500 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2">
                  Submit Another Application
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5" noValidate aria-label="Volunteer application form">
                <input type="text" {...register("_honeypot")} className="sr-only" tabIndex={-1} aria-hidden="true" autoComplete="off" />
                <div className="grid gap-5 sm:grid-cols-2">
                  <VField label="First Name" error={errors.firstName?.message} required><input {...register("firstName")} type="text" placeholder="First name" className={ic(!!errors.firstName)} /></VField>
                  <VField label="Last Name" error={errors.lastName?.message} required><input {...register("lastName")} type="text" placeholder="Last name" className={ic(!!errors.lastName)} /></VField>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <VField label="Email Address" error={errors.email?.message} required><input {...register("email")} type="email" placeholder="your@email.com" className={ic(!!errors.email)} /></VField>
                  <VField label="Phone Number" error={errors.phone?.message} required><input {...register("phone")} type="tel" placeholder="+254 7XX XXX XXX" className={ic(!!errors.phone)} /></VField>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <VField label="County" error={errors.county?.message} required>
                    <select {...register("county")} className={ic(!!errors.county)}>
                      <option value="">Select county</option>
                      {COUNTIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </VField>
                  <VField label="Availability" error={errors.availability?.message} required>
                    <select {...register("availability")} className={ic(!!errors.availability)}>
                      <option value="">Select availability</option>
                      {AVAILABILITY.map((a) => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </VField>
                </div>
                <VField label="Skills & Experience" error={errors.skills?.message} required>
                  <textarea {...register("skills")} rows={3} placeholder="Describe your relevant skills and experience..." className={cn(ic(!!errors.skills), "resize-y min-h-[80px]")} />
                </VField>
                <VField label="Why do you want to volunteer with RHARK?" error={errors.motivation?.message} required>
                  <textarea {...register("motivation")} rows={4} placeholder="Tell us what motivates you to volunteer with RHARK..." className={cn(ic(!!errors.motivation), "resize-y min-h-[100px]")} />
                </VField>
                <button type="submit" disabled={isSubmitting} aria-busy={isSubmitting} className="inline-flex items-center gap-2 rounded-full bg-primary-500 px-8 py-3.5 text-sm font-bold text-white shadow-teal-sm transition-all duration-200 hover:bg-primary-600 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2">
                  {isSubmitting ? "Submitting…" : <><Send size={15} aria-hidden="true" /> Submit Application</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function ic(hasError: boolean) {
  return cn("h-12 w-full rounded-xl border bg-white px-4 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500", hasError ? "border-error-500" : "border-neutral-300 hover:border-neutral-400");
}

function VField({ label, error, required, children }: { label: string; error?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-neutral-700">{label}{required && <span className="ml-1 text-error-500" aria-hidden="true">*</span>}</label>
      {children}
      {error && <p role="alert" className="flex items-center gap-1 text-xs text-error-500"><span aria-hidden="true">⚠</span> {error}</p>}
    </div>
  );
}
