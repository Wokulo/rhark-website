"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94], delay: i * 0.08 },
  }),
};

// Official partner logos live in public/images/partners/.
const PARTNERS = [
  {
    name: "Siaya County Government",
    logo: "/images/partners/siaya-county-government-logo.webp",
  },
  {
    name: "World Health Organization (WHO)",
    logo: "/images/partners/who-logo.png",
  },
  {
    name: "Jaramogi Oginga Odinga University of Science and Technology (JOOUST)",
    logo: "/images/partners/jooust-logo.png",
  },
];

export function PartnersSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      aria-labelledby="partners-heading"
      className="bg-[linear-gradient(180deg,#ffffff_0%,#f8fbfb_100%)] py-12 lg:py-16"
    >
      <div className="container-site">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={0}
          className="mb-10 text-center"
        >
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-neutral-400">
            Our Partners &amp; Supporters
          </p>
          <h2
            id="partners-heading"
            className="mt-2 font-display text-2xl font-bold text-neutral-700"
          >
            Working together for greater impact
          </h2>
        </motion.div>

        <motion.ul
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={1}
          role="list"
          className="mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3"
        >
          {PARTNERS.map((partner, i) => (
            <motion.li
              key={partner.name}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              custom={i + 2}
              className="group flex min-h-28 items-center justify-center rounded-[1.4rem] border border-white/75 bg-white/90 px-6 py-5 shadow-[0_8px_24px_rgba(15,23,42,0.06)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary-100 hover:shadow-[0_18px_44px_rgba(13,110,110,0.14)]"
              title={partner.name}
            >
              <Image
                src={partner.logo}
                alt={`${partner.name} logo`}
                width={200}
                height={80}
                sizes="(max-width: 640px) 100vw, 33vw"
                className="h-16 w-auto max-w-full object-contain grayscale transition-all duration-300 group-hover:grayscale-0"
              />
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

