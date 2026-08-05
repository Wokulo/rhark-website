"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Heart, Users, BookOpen, ArrowRight } from "lucide-react";
import { cn } from "@/utils";
import { ROUTES } from "@/constants";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94], delay: i * 0.1 },
  }),
};

const GET_INVOLVED = [
  { icon: Heart, title: "Donate", description: "Your financial support funds life-changing SRHR programmes, mental health services, and youth empowerment initiatives.", cta: "Donate Now", href: ROUTES.donate, color: "bg-accent-500", lightBg: "bg-accent-50", textColor: "text-accent-600" },
  { icon: Users, title: "Volunteer", description: "Join our network of passionate volunteers and contribute your skills to advancing health and rights in Siaya County.", cta: "Become a Volunteer", href: ROUTES.volunteer, color: "bg-primary-500", lightBg: "bg-primary-50", textColor: "text-primary-600" },
  { icon: BookOpen, title: "Internship", description: "Gain hands-on experience in public health, gender, advocacy, and community development with a leading Kenyan CBO.", cta: "Apply for Internship", href: ROUTES.internship, color: "bg-secondary-400", lightBg: "bg-secondary-50", textColor: "text-secondary-500" },
];

export function GetInvolvedSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} aria-labelledby="get-involved-heading" className="bg-[radial-gradient(circle_at_top,rgba(13,110,110,0.06),transparent_28%),linear-gradient(180deg,#f8fbfb_0%,#ffffff_100%)] py-12 lg:py-16">
      <div className="container-site">
        <motion.div variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}           className="mx-auto mb-10 max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary-500">Get Involved</p>
          <h2 id="get-involved-heading" className="mt-3 font-display text-3xl font-extrabold text-neutral-900 text-balance lg:text-5xl">
            Join the movement for change
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-neutral-600">
            There are many ways to support RHARK's mission. Every contribution — big or small — makes a difference.
          </p>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-3">
          {GET_INVOLVED.map((item, i) => (
            <motion.div
              key={item.title}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              custom={i + 1}
              className="group flex h-full flex-col rounded-[1.6rem] border border-white/75 bg-white/90 p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition-all duration-250 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)] backdrop-blur-sm"
            >
              <div className={cn("mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm", item.color)}>
                <item.icon size={26} className="text-white" aria-hidden="true" />
              </div>
              <h3 className="font-display text-xl font-bold text-neutral-900">{item.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-500">{item.description}</p>
              <Link
                href={item.href}
                className={cn(
                  "mt-5 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                  item.color,
                  item.title === "Donate" ? "shadow-amber focus-visible:ring-accent-500" : item.title === "Volunteer" ? "shadow-teal-sm focus-visible:ring-primary-500" : "focus-visible:ring-secondary-400"
                )}
              >
                {item.cta} <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
