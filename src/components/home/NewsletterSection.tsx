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
    <section ref={ref} aria-labelledby="newsletter-heading" className="bg-white py-20 lg:py-24">
      <div className="container-site">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={0}
          className="mx-auto max-w-2xl rounded-3xl bg-gradient-to-br from-primary-600 to-primary-700 p-10 text-center shadow-teal lg:p-14"
        >
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
            <Mail size={26} className="text-white" aria-hidden="true" />
          </div>
          <h2 id="newsletter-heading" className="font-display text-2xl font-extrabold text-white lg:text-3xl">
            Stay connected with RHARK
          </h2>
          <p className="mx-auto mt-3 max-w-md text-base text-primary-200">
            Get our latest news, programme updates, publications, and event invitations delivered to your inbox.
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 flex items-center justify-center gap-3 rounded-2xl bg-white/15 px-6 py-4"
            >
              <CheckCircle2 size={22} className="text-white" aria-hidden="true" />
              <p className="font-semibold text-white">Thank you! You are now subscribed.</p>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
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
                className="h-12 flex-1 rounded-full border-0 bg-white/15 px-5 text-sm text-white placeholder:text-primary-300 focus:outline-none focus:ring-2 focus:ring-white transition-colors duration-150 hover:bg-white/20"
              />
              <button
                type="submit"
                className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-accent-500 px-6 text-sm font-bold text-white shadow-amber transition-colors duration-150 hover:bg-accent-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
              >
                Subscribe <ArrowRight size={14} aria-hidden="true" />
              </button>
            </form>
          )}
          <p className="mt-4 text-xs text-primary-300">
            No spam. Unsubscribe anytime. We comply with the Kenya Data Protection Act 2019.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
