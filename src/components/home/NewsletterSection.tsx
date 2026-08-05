"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94], delay: i * 0.1 },
  }),
};

export function NewsletterSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section ref={ref} aria-labelledby="newsletter-heading" className="bg-[linear-gradient(180deg,#ffffff_0%,#f8fbfb_100%)] py-12 lg:py-16">
      <div className="container-site">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={0}
          className="mx-auto max-w-3xl rounded-[2rem] bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_30%),linear-gradient(135deg,#0f766e_0%,#0d6e6e_100%)] p-8 text-center shadow-[0_30px_80px_rgba(13,110,110,0.24)] ring-1 ring-white/10 lg:p-10"
        >
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-[1.2rem] bg-white/15 ring-1 ring-white/20">
            <Mail size={26} className="text-white" aria-hidden="true" />
          </div>
          <h2 id="newsletter-heading" className="font-display text-2xl font-extrabold text-white lg:text-4xl">
            Stay connected with RHARK
          </h2>
          <p className="mx-auto mt-2 max-w-md text-base leading-relaxed text-primary-100">
            Get our latest news, programme updates, publications, and event invitations delivered to your inbox.
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 flex items-center justify-center gap-3 rounded-[1.2rem] bg-white/15 px-6 py-4 ring-1 ring-white/10"
            >
              <CheckCircle2 size={22} className="text-white" aria-hidden="true" />
              <p className="font-semibold text-white">Thank you! You are now subscribed.</p>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-6 flex flex-col gap-3 sm:flex-row"
              aria-label="Newsletter signup form"
            >
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                autoComplete="email"
                className="h-12 flex-1 rounded-full border-0 bg-white/15 px-5 text-sm text-white placeholder:text-primary-200 transition-colors duration-150 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                type="submit"
                className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-accent-500 px-6 text-sm font-bold text-white shadow-[0_14px_32px_rgba(245,158,11,0.28)] transition-colors duration-150 hover:bg-accent-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
              >
                Subscribe <ArrowRight size={14} aria-hidden="true" />
              </button>
            </form>
          )}
          <p className="mt-3 text-xs text-primary-300">
            No spam. Unsubscribe anytime. We comply with the Kenya Data Protection Act 2019.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
