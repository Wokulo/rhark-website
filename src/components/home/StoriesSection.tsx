"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Quote } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94], delay: i * 0.12 },
  }),
};

const STORIES = [
  {
    quote: "RHARK's SRHR programme gave me the knowledge and confidence to make informed decisions about my health. I now educate my peers in our village.",
    name: "Akinyi W.",
    role: "Youth Beneficiary, Bondo",
    initials: "AW",
    color: "bg-primary-500",
  },
  {
    quote: "The mental health sessions helped me understand that seeking help is a sign of strength, not weakness. I am grateful for RHARK's support.",
    name: "Otieno M.",
    role: "Community Member, Siaya",
    initials: "OM",
    color: "bg-secondary-400",
  },
  {
    quote: "As a community health volunteer trained by RHARK, I have been able to reach over 200 women with maternal health information in my ward.",
    name: "Adhiambo N.",
    role: "Community Health Volunteer",
    initials: "AN",
    color: "bg-accent-500",
  },
];

export function StoriesSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} aria-labelledby="stories-heading" className="bg-primary-600 py-20 lg:py-28">
      <div className="container-site">
        <motion.div variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0} className="mb-14 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-primary-200">Success Stories</p>
          <h2 id="stories-heading" className="mt-2 font-display text-3xl font-extrabold text-white text-balance lg:text-4xl">
            Voices from our community
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-primary-200">
            Real stories from the people whose lives have been transformed by RHARK's programmes.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {STORIES.map((story, i) => (
            <motion.blockquote
              key={story.name}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              custom={i + 1}
              className="flex flex-col rounded-2xl bg-white/10 p-7 backdrop-blur-sm ring-1 ring-white/20"
            >
              <Quote size={28} className="mb-4 text-primary-300" aria-hidden="true" />
              <p className="flex-1 text-base leading-relaxed text-white">{story.quote}</p>
              <footer className="mt-6 flex items-center gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${story.color} text-sm font-bold text-white`} aria-hidden="true">
                  {story.initials}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{story.name}</p>
                  <p className="text-xs text-primary-300">{story.role}</p>
                </div>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
