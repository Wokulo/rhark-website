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
    <section ref={ref} aria-labelledby="get-involved-heading" className="bg-neutral-50 py-20 lg:py-28">
      <div className="container-site">
        <motion.div variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0} className="mb-14 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-primary-500">Get Involved</p>
          <h2 id="get-involved-heading" className="mt-2 font-display text-3xl font-extrabold text-neutral-900 text-balance lg:text-4xl">
            Join the movement for change
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-neutral-600">
            There are many ways to support RHARK's mission. Every contribution — big or small — makes a difference.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {GET_INVOLVED.map((item, i) => (
            <motion.div
              key={item.title}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              custom={i + 1}
              className="group flex flex-col rounded-2xl bg-white p-8 ring-1 ring-neutral-200 transition-all duration-250 hover:shadow-lg hover:ring-neutral-300"
            >
              <div className={cn("mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl", item.color)}>
                <item.icon size={26} className="text-white" aria-hidden="true" />
              </div>
              <h3 className="font-display text-xl font-bold text-neutral-900">{item.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-neutral-500">{item.description}</p>
              <Link
                href={item.href}
                className={cn(
                  "mt-6 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5",
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
