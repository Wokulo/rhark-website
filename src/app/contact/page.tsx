"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { contactSchema, type ContactSchema } from "@/lib/validations";
import { ORG, SOCIAL_LINKS } from "@/constants";
import { cn } from "@/utils";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactSchema>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactSchema) => {
    setServerError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to send");
      setSubmitted(true);
      reset();
    } catch {
      setServerError("Something went wrong. Please try again or email us directly.");
    }
  };

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 py-24 lg:py-32" aria-labelledby="contact-hero-heading">
        <div className="container-site text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-primary-200">Get in Touch</p>
          <h1 id="contact-hero-heading" className="mt-3 font-display text-4xl font-extrabold text-white text-balance lg:text-5xl">
            Contact Us
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-primary-200">
            We would love to hear from you. Reach out with questions, partnership enquiries, or to learn more about our work.
          </p>
          <nav aria-label="Breadcrumb" className="mt-6 flex items-center justify-center gap-2 text-sm text-primary-300">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span aria-hidden="true">/</span>
            <span className="text-white" aria-current="page">Contact</span>
          </nav>
        </div>
      </section>

      <section className="py-20 lg:py-28" aria-labelledby="contact-form-heading">
        <div className="container-site grid gap-14 lg:grid-cols-3 lg:gap-20">

          {/* Contact info */}
          <aside className="space-y-8">
            <div>
              <h2 id="contact-info-heading" className="font-display text-xl font-bold text-neutral-900">
                Our Office
              </h2>
              <div className="mt-5 space-y-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50">
                    <MapPin size={18} className="text-primary-500" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-800">Head Office</p>
                    <p className="mt-1 text-sm leading-relaxed text-neutral-500">{ORG.address}</p>
                    <p className="text-sm text-neutral-400">{ORG.postalAddress}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50">
                    <Mail size={18} className="text-primary-500" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-800">Email</p>
                    <a href={`mailto:${ORG.email}`} className="mt-1 text-sm text-primary-600 hover:underline">
                      {ORG.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50">
                    <Phone size={18} className="text-primary-500" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-800">Phone</p>
                    <a href={`tel:${ORG.phone.replace(/\s/g, "")}`} className="mt-1 text-sm text-primary-600 hover:underline">
                      {ORG.phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-display text-base font-bold text-neutral-900">Office Hours</h3>
              <div className="mt-3 space-y-1 text-sm text-neutral-500">
                <p>Monday – Friday: 8:00 AM – 5:00 PM EAT</p>
                <p>Saturday: 9:00 AM – 1:00 PM EAT</p>
                <p>Sunday: Closed</p>
              </div>
            </div>

            <div>
              <h3 className="font-display text-base font-bold text-neutral-900">Follow Us</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {Object.entries(SOCIAL_LINKS).map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-neutral-100 px-3 py-2 text-xs font-semibold capitalize text-neutral-600 transition-colors hover:bg-primary-50 hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                  >
                    {platform}
                  </a>
                ))}
              </div>
            </div>
          </aside>

          {/* Contact form */}
          <div className="lg:col-span-2">
            <h2 id="contact-form-heading" className="font-display text-xl font-bold text-neutral-900">
              Send Us a Message
            </h2>

            {submitted ? (
              <div className="mt-8 flex flex-col items-center gap-4 rounded-2xl bg-success-50 p-10 text-center ring-1 ring-success-100">
                <CheckCircle2 size={48} className="text-success-500" aria-hidden="true" />
                <h3 className="font-display text-xl font-bold text-neutral-900">Message Sent!</h3>
                <p className="max-w-sm text-neutral-600">
                  Thank you for reaching out. We will get back to you within 2 business days.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-2 rounded-full bg-primary-500 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-8 space-y-5"
                aria-label="Contact form"
                noValidate
              >
                {/* Honeypot — hidden from real users */}
                <input type="text" {...register("_honeypot")} className="sr-only" tabIndex={-1} aria-hidden="true" autoComplete="off" />

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Full Name" error={errors.name?.message} required>
                    <input
                      {...register("name")}
                      type="text"
                      autoComplete="name"
                      placeholder="Your full name"
                      className={inputClass(!!errors.name)}
                    />
                  </Field>
                  <Field label="Email Address" error={errors.email?.message} required>
                    <input
                      {...register("email")}
                      type="email"
                      autoComplete="email"
                      placeholder="your@email.com"
                      className={inputClass(!!errors.email)}
                    />
                  </Field>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Phone Number" error={errors.phone?.message}>
                    <input
                      {...register("phone")}
                      type="tel"
                      autoComplete="tel"
                      placeholder="+254 7XX XXX XXX"
                      className={inputClass(!!errors.phone)}
                    />
                  </Field>
                  <Field label="Subject" error={errors.subject?.message} required>
                    <input
                      {...register("subject")}
                      type="text"
                      placeholder="How can we help?"
                      className={inputClass(!!errors.subject)}
                    />
                  </Field>
                </div>

                <Field label="Message" error={errors.message?.message} required>
                  <textarea
                    {...register("message")}
                    rows={5}
                    placeholder="Tell us more about your enquiry..."
                    className={cn(inputClass(!!errors.message), "resize-y min-h-[120px]")}
                  />
                </Field>

                {serverError && (
                  <p role="alert" className="rounded-xl bg-error-50 px-4 py-3 text-sm text-error-600 ring-1 ring-error-200">
                    {serverError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-full bg-primary-500 px-8 py-3.5 text-sm font-bold text-white shadow-teal-sm transition-all duration-200 hover:bg-primary-600 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                >
                  {isSubmitting ? "Sending…" : (<><Send size={15} aria-hidden="true" /> Send Message</>)}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function inputClass(hasError: boolean) {
  return cn(
    "h-12 w-full rounded-xl border bg-white px-4 text-sm text-neutral-900 placeholder:text-neutral-400",
    "transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
    hasError ? "border-error-500 focus:ring-error-500" : "border-neutral-300 hover:border-neutral-400"
  );
}

function Field({ label, error, required, children }: { label: string; error?: string; required?: boolean; children: React.ReactNode }) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-neutral-700">
        {label}{required && <span className="ml-1 text-error-500" aria-hidden="true">*</span>}
      </label>
      <div id={id}>{children}</div>
      {error && <p role="alert" className="flex items-center gap-1 text-xs text-error-500"><span aria-hidden="true">⚠</span> {error}</p>}
    </div>
  );
}
