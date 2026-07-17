"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { partnershipInquirySchema, type PartnershipInquirySchema } from "@/lib/validations";
import { Send, CheckCircle2 } from "lucide-react";
import { cn } from "@/utils";

const PARTNERSHIP_TYPES = ["Funding & Grant", "Programme Implementation", "Government & Policy", "Research & Learning", "Media & Communications", "Corporate Social Responsibility"];

export default function PartnerForm() {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<PartnershipInquirySchema>({
    resolver: zodResolver(partnershipInquirySchema),
  });

  const onSubmit = async (data: PartnershipInquirySchema) => {
    try {
      const res = await fetch("/api/partner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to submit inquiry");
      }
      setSubmitted(true);
      reset();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to submit inquiry");
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-success-50 p-10 text-center ring-1 ring-success-100">
        <CheckCircle2 size={48} className="text-success-500" aria-hidden="true" />
        <h3 className="font-display text-xl font-bold text-neutral-900">Inquiry Received!</h3>
        <p className="max-w-sm text-neutral-600">Thank you for your interest in partnering with RHARK. We will review your inquiry and get back to you within 3 business days.</p>
        <button onClick={() => setSubmitted(false)} className="mt-2 rounded-full bg-primary-500 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2">
          Submit Another Inquiry
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-neutral-50 p-6 ring-1 ring-neutral-200">
      <p className="text-sm font-semibold uppercase tracking-widest text-primary-500">
        Partnership inquiry
      </p>
      <h2 className="mt-2 font-display text-2xl font-bold text-neutral-900">
        Start a collaboration conversation
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5" noValidate aria-label="Partnership inquiry form">
        <input type="text" {...register("_honeypot")} className="sr-only" tabIndex={-1} aria-hidden="true" autoComplete="off" />
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-700">Organization Name <span className="ml-1 text-error-500" aria-hidden="true">*</span></label>
            <input {...register("organizationName")} className={cn("h-12 w-full rounded-xl border bg-white px-4 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500", !!errors.organizationName ? "border-error-500" : "border-neutral-300 hover:border-neutral-400")} placeholder="Organization name" />
            {errors.organizationName && <p role="alert" className="flex items-center gap-1 text-xs text-error-500"><span aria-hidden="true">⚠</span> {errors.organizationName.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-700">Contact Name <span className="ml-1 text-error-500" aria-hidden="true">*</span></label>
            <input {...register("contactName")} className={cn("h-12 w-full rounded-xl border bg-white px-4 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500", !!errors.contactName ? "border-error-500" : "border-neutral-300 hover:border-neutral-400")} placeholder="Your full name" />
            {errors.contactName && <p role="alert" className="flex items-center gap-1 text-xs text-error-500"><span aria-hidden="true">⚠</span> {errors.contactName.message}</p>}
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-700">Email Address <span className="ml-1 text-error-500" aria-hidden="true">*</span></label>
            <input {...register("email")} type="email" className={cn("h-12 w-full rounded-xl border bg-white px-4 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500", !!errors.email ? "border-error-500" : "border-neutral-300 hover:border-neutral-400")} placeholder="your@email.com" />
            {errors.email && <p role="alert" className="flex items-center gap-1 text-xs text-error-500"><span aria-hidden="true">⚠</span> {errors.email.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-700">Phone Number</label>
            <input {...register("phone")} type="tel" className={cn("h-12 w-full rounded-xl border bg-white px-4 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500", !!errors.phone ? "border-error-500" : "border-neutral-300 hover:border-neutral-400")} placeholder="+254 7XX XXX XXX" />
            {errors.phone && <p role="alert" className="flex items-center gap-1 text-xs text-error-500"><span aria-hidden="true">⚠</span> {errors.phone.message}</p>}
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-700">Partnership Type <span className="ml-1 text-error-500" aria-hidden="true">*</span></label>
          <select {...register("partnershipType")} className={cn("h-12 w-full rounded-xl border bg-white px-4 text-sm text-neutral-900 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500", !!errors.partnershipType ? "border-error-500" : "border-neutral-300 hover:border-neutral-400")}>
            <option value="">Select partnership type</option>
            {PARTNERSHIP_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          {errors.partnershipType && <p role="alert" className="flex items-center gap-1 text-xs text-error-500"><span aria-hidden="true">⚠</span> {errors.partnershipType.message}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-700">Message <span className="ml-1 text-error-500" aria-hidden="true">*</span></label>
          <textarea {...register("message")} rows={5} className={cn("w-full rounded-xl border bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-y min-h-[120px]", !!errors.message ? "border-error-500" : "border-neutral-300 hover:border-neutral-400")} placeholder="Tell us about your organization and how you would like to partner with RHARK..." />
          {errors.message && <p role="alert" className="flex items-center gap-1 text-xs text-error-500"><span aria-hidden="true">⚠</span> {errors.message.message}</p>}
        </div>
        <button type="submit" disabled={isSubmitting} aria-busy={isSubmitting} className="inline-flex items-center gap-2 rounded-full bg-primary-500 px-8 py-3.5 text-sm font-bold text-white shadow-teal-sm transition-all duration-200 hover:bg-primary-600 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2">
          {isSubmitting ? "Submitting…" : <><Send size={15} aria-hidden="true" /> Submit Inquiry</>}
        </button>
      </form>
    </div>
  );
}
