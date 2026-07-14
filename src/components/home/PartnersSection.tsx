"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94], delay: i * 0.08 },
  }),
};

// Partner logos live in public/images/logo/
const PARTNERS = [
  { name: "Ministry of Health Kenya", logo: "/images/logo/MINISTRY OF HEALTH LOGO PNG.jpg" },
  { name: "Siaya County Government", logo: "/images/logo/siaya county government logo.png" },
  { name: "UNFPA Kenya", logo: "/images/logo/unfpa-logo PNG.png" },
  { name: "Kenya Red Cross", logo: "/images/logo/krc-research-logo PNG.png" },
  { name: "Amref Health Africa", logo: "/images/logo/amref logo PNG.jpg" },
  { name: "Kenya Medical Research Institute", logo: "/images/logo/KEMRI Logo PNG.png" },
];

export function PartnersSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} aria-labelledby="partners-heading" className="bg-neutral-50 py-16 lg:py-20">
      <div className="container-site">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={0}
          className="mb-10 text-center"
        >
          <p className="text-sm font-bold uppercase tracking-widest text-neutral-400">
            Our Partners &amp; Supporters
          </p>
          <h2
            id="partners-heading"
            className="mt-2 font-display text-xl font-bold text-neutral-700"
          >
            Working together for greater impact
          </h2>
        </motion.div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          {PARTNERS.map((partner, i) => (
            <motion.div
              key={partner.name}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              custom={i + 1}
              className="flex h-16 min-w-[140px] items-center justify-center rounded-xl bg-white px-6 shadow-sm ring-1 ring-neutral-200 transition-all duration-200 hover:shadow-md hover:ring-neutral-300"
              title={partner.name}
            >
              <Image
                src={partner.logo}
                alt={`${partner.name} logo`}
                width={120}
                height={48}
                className="max-h-10 w-auto object-contain"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
