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

interface Partner {
  id: string;
  name: string;
  logoUrl: string;
  website?: string | null;
}

const DEFAULT_PARTNERS: Partner[] = [
  {
    id: "default-1",
    name: "Siaya County Government",
    logoUrl: "/images/partners/siaya-county-government-logo.webp",
  },
  {
    id: "default-2",
    name: "World Health Organization (WHO)",
    logoUrl: "/images/partners/who-logo.png",
  },
  {
    id: "default-3",
    name: "Jaramogi Oginga Odinga University of Science and Technology (JOOUST)",
    logoUrl: "/images/partners/jooust-logo.png",
  },
];

export function PartnersSection({ content }: { content?: { heading: string; partners?: Partner[] } }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const displayPartners = content?.partners && content.partners.length > 0 ? content.partners : DEFAULT_PARTNERS;
  const heading = content?.heading ?? "Working together for greater impact";

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
          className="mx-auto mb-10 max-w-3xl text-center"
        >
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-neutral-400">
            Our Partners & Supporters
          </p>
          <h2
            id="partners-heading"
            className="mt-2 font-display text-2xl font-bold text-neutral-700"
          >
            {heading}
          </h2>
        </motion.div>

        <motion.ul
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={1}
          role="list"
          className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-6 lg:grid-cols-3"
        >
          {displayPartners.map((partner, i) => (
            <motion.li
              key={partner.id}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              custom={i + 2}
              className="group flex items-center justify-center rounded-[1.6rem] border border-white/75 bg-white/90 px-6 py-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary-100 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)]"
              title={partner.name}
            >
              <Image
                src={partner.logoUrl}
                alt={`${partner.name} logo`}
                width={200}
                height={80}
                sizes="(max-width: 640px) 100vw, 33vw"
                className="h-16 w-auto max-w-full object-contain grayscale transition-all duration-300 ease-out group-hover:grayscale-0 group-hover:scale-105"
                quality={90}
              />
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}