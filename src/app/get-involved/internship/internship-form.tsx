"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, CheckCircle2 } from "lucide-react";
import { cn } from "@/utils";

const DURATIONS = ["1-3 months", "3-6 months", "6-12 months", "12+ months"];
const AREAS = ["Sexual & Reproductive Health","Mental Health & Wellness","Gender Equality & GBV","Research & Monitoring","Communications & Media","Finance & Administration","IT & Digital Systems","Governance & Advocacy"];

const internshipSchema = z.object({
  firstName: z.string().min(2, "First name is required").max(100),
  lastName: z.string().min(2, "Last name is required").max(100),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  phone: z.string().regex(/^(\+254|0)[17]\d{8}$/, "Please enter a valid Kenyan phone number"),
  area: z.string().min(1, "Please select an internship area"),
  duration: z.string().min(1, "Please select duration"),
  startDate: z.string().min(1, "Please provide your start date"),
  motivation: z.string().min(30, "Please tell us why you want to intern with RHARK (min 30 characters)").max(1000),
  cvUrl: z.string().url("Please provide a valid URL to your CV").optional().or(z.literal("")),
  _honeypot: z.string().max(0, "Invalid submission"),
});

type InternshipSchema = z.infer<typeof internshipSchema>;

export default function InternshipForm() {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<InternshipSchema>({
    resolver: zodResolver(internshipSchema),
  });

  const onSubmit = async (data: InternshipSchema) => {
    try {
      const res = await fetch("/api/internship", {
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

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-success-50 p-8 text-center ring-1 ring-success-100">
        <CheckCircle2 size={40} className="text-success-500" aria-hidden="true" />
        <h4 className="font-display text-lg font-bold text-neutral-900">Application Received!</h4>
        <p className="text-sm text-neutral-600">Thank you for applying. We will review your application and get back to you within 5 business days.</p>
        <button onClick={() => setSubmitted(false)} className="mt-2 rounded-full bg-secondary-400 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-secondary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-400 focus-visible:ring-offset-2">
          Submit Another Application
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-secondary-50 p-8 ring-1 ring-secondary-100">
      <h3 className="font-display text-lg font-bold text-neutral-900">Apply Now</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate aria-label="Internship application form">
        <input type="text" {...register("_honeypot")} className="sr-only" tabIndex={-1} aria-hidden="true" autoComplete="off" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-700">First Name <span className="ml-1 text-error-500" aria-hidden="true">*</span></label>
            <input {...register("firstName")} className={cn("h-12 w-full rounded-xl border bg-white px-4 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500", !!errors.firstName ? "border-error-500" : "border-neutral-300 hover:border-neutral-400")} placeholder="First name" />
            {errors.firstName && <p role="alert" className="flex items-center gap-1 text-xs text-error-500"><span aria-hidden="true">⚠</span> {errors.firstName.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-700">Last Name <span className="ml-1 text-error-500" aria-hidden="true">*</span></label>
            <input {...register("lastName")} className={cn("h-12 w-full rounded-xl border bg-white px-4 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500", !!errors.lastName ? "border-error-500" : "border-neutral-300 hover:border-neutral-400")} placeholder="Last name" />
            {errors.lastName && <p role="alert" className="flex items-center gap-1 text-xs text-error-500"><span aria-hidden="true">⚠</span> {errors.lastName.message}</p>}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-700">Email Address <span className="ml-1 text-error-500" aria-hidden="true">*</span></label>
            <input {...register("email")} type="email" className={cn("h-12 w-full rounded-xl border bg-white px-4 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500", !!errors.email ? "border-error-500" : "border-neutral-300 hover:border-neutral-400")} placeholder="your@email.com" />
            {errors.email && <p role="alert" className="flex items-center gap-1 text-xs text-error-500"><span aria-hidden="true">⚠</span> {errors.email.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-700">Phone Number <span className="ml-1 text-error-500" aria-hidden="true">*</span></label>
            <input {...register("phone")} type="tel" className={cn("h-12 w-full rounded-xl border bg-white px-4 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500", !!errors.phone ? "border-error-500" : "border-neutral-300 hover:border-neutral-400")} placeholder="+254 7XX XXX XXX" />
            {errors.phone && <p role="alert" className="flex items-center gap-1 text-xs text-error-500"><span aria-hidden="true">⚠</span> {errors.phone.message}</p>}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-700">Internship Area <span className="ml-1 text-error-500" aria-hidden="true">*</span></label>
            <select {...register("area")} className={cn("h-12 w-full rounded-xl border bg-white px-4 text-sm text-neutral-900 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500", !!errors.area ? "border-error-500" : "border-neutral-300 hover:border-neutral-400")}>
              <option value="">Select area</option>
              {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
            {errors.area && <p role="alert" className="flex items-center gap-1 text-xs text-error-500"><span aria-hidden="true">⚠</span> {errors.area.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-700">Preferred Duration <span className="ml-1 text-error-500" aria-hidden="true">*</span></label>
            <select {...register("duration")} className={cn("h-12 w-full rounded-xl border bg-white px-4 text-sm text-neutral-900 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500", !!errors.duration ? "border-error-500" : "border-neutral-300 hover:border-neutral-400")}>
              <option value="">Select duration</option>
              {DURATIONS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            {errors.duration && <p role="alert" className="flex items-center gap-1 text-xs text-error-500"><span aria-hidden="true">⚠</span> {errors.duration.message}</p>}
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-700">Earliest Start Date <span className="ml-1 text-error-500" aria-hidden="true">*</span></label>
          <input {...register("startDate")} type="date" className={cn("h-12 w-full rounded-xl border bg-white px-4 text-sm text-neutral-900 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500", !!errors.startDate ? "border-error-500" : "border-neutral-300 hover:border-neutral-400")} />
          {errors.startDate && <p role="alert" className="flex items-center gap-1 text-xs text-error-500"><span aria-hidden="true">⚠</span> {errors.startDate.message}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-700">Motivation <span className="ml-1 text-error-500" aria-hidden="true">*</span></label>
          <textarea {...register("motivation")} rows={4} className={cn("w-full rounded-xl border bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-y min-h-[100px]", !!errors.motivation ? "border-error-500" : "border-neutral-300 hover:border-neutral-400")} placeholder="Tell us why you want to intern with RHARK and what you hope to gain..." />
          {errors.motivation && <p role="alert" className="flex items-center gap-1 text-xs text-error-500"><span aria-hidden="true">⚠</span> {errors.motivation.message}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-700">CV / Resume URL</label>
          <input {...register("cvUrl")} type="url" className={cn("h-12 w-full rounded-xl border bg-white px-4 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500", !!errors.cvUrl ? "border-error-500" : "border-neutral-300 hover:border-neutral-400")} placeholder="https://docs.google.com/..." />
          {errors.cvUrl && <p role="alert" className="flex items-center gap-1 text-xs text-error-500"><span aria-hidden="true">⚠</span> {errors.cvUrl.message}</p>}
        </div>
        <button type="submit" disabled={isSubmitting} aria-busy={isSubmitting} className="inline-flex items-center gap-2 rounded-full bg-secondary-400 px-8 py-3.5 text-sm font-bold text-white shadow-teal-sm transition-all duration-200 hover:bg-secondary-500 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-400 focus-visible:ring-offset-2">
          {isSubmitting ? "Submitting…" : <><Send size={15} aria-hidden="true" /> Submit Application</>}
        </button>
      </form>
    </div>
  );
}
