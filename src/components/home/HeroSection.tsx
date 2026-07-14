"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Heart,
  Users,
  Brain,
  Shield,
  Leaf,
  Landmark,
  CheckCircle2,
  Play,
} from "lucide-react";
import { cn } from "@/utils";
import { ROUTES, ORG } from "@/constants";

// ─── Animation Variants ───────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: { duration: 0.5, delay },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: (delay = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.55, ease: [0.34, 1.56, 0.64, 1], delay },
  }),
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const FLOATING_CARDS = [
  { icon: Heart, label: "SRHR", color: "bg-primary-500", delay: 0.6 },
  { icon: Brain, label: "Mental Health", color: "bg-secondary-400", delay: 0.75 },
  { icon: Users, label: "Gender Equality", color: "bg-accent-500", delay: 0.9 },
  { icon: Shield, label: "HIV Prevention", color: "bg-primary-400", delay: 1.05 },
  { icon: Leaf, label: "Climate Justice", color: "bg-success-500", delay: 1.2 },
  { icon: Landmark, label: "Governance", color: "bg-info-500", delay: 1.35 },
];

const TRUST_BADGES = [
  { icon: CheckCircle2, text: "Registered CBO, Kenya" },
  { icon: CheckCircle2, text: "Serving Siaya County & Beyond" },
  { icon: CheckCircle2, text: "Community-Led Development" },
  { icon: CheckCircle2, text: "Partnership Driven" },
];

// ─── FloatingInfoCard ─────────────────────────────────────────────────────────

function FloatingInfoCard({
  icon: Icon,
  label,
  color,
  delay,
  className,
}: {
  icon: React.ElementType;
  label: string;
  color: string;
  delay: number;
  className?: string;
}) {
  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      animate="visible"
      custom={delay}
      className={cn(
        "absolute flex items-center gap-2.5 rounded-2xl bg-white px-4 py-3",
        "shadow-lg ring-1 ring-neutral-100",
        className
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl",
          color
        )}
      >
        <Icon size={15} className="text-white" aria-hidden="true" />
      </div>
      <span className="whitespace-nowrap text-sm font-semibold text-neutral-800">
        {label}
      </span>
    </motion.div>
  );
}

// ─── HeroVisual ───────────────────────────────────────────────────────────────

function HeroVisual() {
  return (
    <div className="relative flex items-center justify-center">
      {/* Decorative background blob */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        custom={0.2}
        className="absolute -inset-8 rounded-[3rem] bg-gradient-to-br from-primary-100 via-primary-50 to-accent-50 opacity-60"
        aria-hidden="true"
      />

      {/* Main image container */}
      <motion.div
        variants={scaleIn}
        initial="hidden"
        animate="visible"
        custom={0.3}
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-[2rem] shadow-2xl"
      >
        <div className="relative aspect-[4/5] w-full bg-gradient-to-br from-primary-200 to-primary-400">
          <Image
            src="/images/logo/RHARK LOGO PNG.jpeg"
            alt="RHARK - Community Based Organization Logo"
            fill
            className="object-contain p-6"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {/* Gradient overlay for text legibility */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-primary-900/40 via-transparent to-transparent"
            aria-hidden="true"
          />
          {/* Bottom caption bar */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <div className="rounded-xl bg-white/15 p-3 backdrop-blur-md">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/80">
                Our Community
              </p>
              <p className="mt-0.5 text-sm font-bold text-white">
                Empowering lives in Siaya County
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating programme cards */}
      <FloatingInfoCard
        icon={FLOATING_CARDS[0].icon}
        label={FLOATING_CARDS[0].label}
        color={FLOATING_CARDS[0].color}
        delay={FLOATING_CARDS[0].delay}
        className="-left-6 top-12 lg:-left-12"
      />
      <FloatingInfoCard
        icon={FLOATING_CARDS[1].icon}
        label={FLOATING_CARDS[1].label}
        color={FLOATING_CARDS[1].color}
        delay={FLOATING_CARDS[1].delay}
        className="-right-4 top-24 lg:-right-10"
      />
      <FloatingInfoCard
        icon={FLOATING_CARDS[2].icon}
        label={FLOATING_CARDS[2].label}
        color={FLOATING_CARDS[2].color}
        delay={FLOATING_CARDS[2].delay}
        className="-left-4 bottom-32 lg:-left-10"
      />
      <FloatingInfoCard
        icon={FLOATING_CARDS[3].icon}
        label={FLOATING_CARDS[3].label}
        color={FLOATING_CARDS[3].color}
        delay={FLOATING_CARDS[3].delay}
        className="-right-2 bottom-20 lg:-right-8"
      />

      {/* Decorative circles */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        custom={0.4}
        className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-accent-100 opacity-70"
        aria-hidden="true"
      />
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        custom={0.5}
        className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-primary-100 opacity-50"
        aria-hidden="true"
      />
    </div>
  );
}

// ─── HeroButtons ──────────────────────────────────────────────────────────────

function HeroButtons() {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      custom={0.45}
      className="flex flex-wrap gap-3"
    >
      <Link
        href={ROUTES.about}
        className={cn(
          "inline-flex items-center gap-2 rounded-full bg-primary-500 px-6 py-3.5 text-sm font-bold text-white shadow-teal",
          "transition-all duration-200 hover:bg-primary-600 hover:shadow-teal hover:-translate-y-0.5",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        )}
      >
        Learn About RHARK
        <ArrowRight size={16} aria-hidden="true" />
      </Link>

      <Link
        href={ROUTES.programmes}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border-2 border-primary-500 px-6 py-3.5 text-sm font-bold text-primary-600",
          "transition-all duration-200 hover:bg-primary-50 hover:-translate-y-0.5",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        )}
      >
        <Landmark size={16} aria-hidden="true" />
        Explore Our Programs
      </Link>

      <Link
        href={ROUTES.donate}
        className={cn(
          "inline-flex items-center gap-2 rounded-full bg-accent-500 px-6 py-3.5 text-sm font-bold text-white shadow-amber",
          "transition-all duration-200 hover:bg-accent-600 hover:shadow-amber hover:-translate-y-0.5",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2"
        )}
      >
        <Heart size={16} aria-hidden="true" fill="currentColor" />
        Support Our Mission
      </Link>
    </motion.div>
  );
}

// ─── HeroStats (trust badges) ─────────────────────────────────────────────────

function HeroTrustBadges() {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      custom={0.55}
      className="flex flex-wrap gap-x-5 gap-y-2"
      aria-label="Trust indicators"
    >
      {TRUST_BADGES.map(({ icon: Icon, text }) => (
        <div key={text} className="flex items-center gap-1.5">
          <Icon
            size={14}
            className="shrink-0 text-primary-500"
            aria-hidden="true"
          />
          <span className="text-xs font-medium text-neutral-600">{text}</span>
        </div>
      ))}
    </motion.div>
  );
}

// ─── HeroContent ──────────────────────────────────────────────────────────────

function HeroContent() {
  return (
    <div className="flex flex-col gap-7">
      {/* Eyebrow label */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.1}
      >
        <span className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary-600 ring-1 ring-primary-100">
          <span
            className="h-1.5 w-1.5 rounded-full bg-primary-500 animate-pulse-soft"
            aria-hidden="true"
          />
          Community-Based Organization · Since {ORG.founded}
        </span>
      </motion.div>

      {/* Main heading */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.2}>
        <h1 className="font-display text-fluid-2xl font-extrabold leading-[1.05] tracking-tight text-neutral-900 text-balance">
          Empowering{" "}
          <span className="relative">
            <span className="text-gradient">Communities.</span>
          </span>
          <br />
          <span className="text-primary-600">Advancing</span> Sexual &amp;
          <br />
          Reproductive Health
          <br />
          and Rights.
        </h1>
      </motion.div>

      {/* Supporting text */}
      <motion.p
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.3}
        className="max-w-xl text-lg leading-relaxed text-neutral-600"
      >
        RHARK is a community-based organization in{" "}
        <strong className="font-semibold text-neutral-800">
          Siaya County, Kenya
        </strong>
        , dedicated to advancing SRHR, mental health, gender equality, HIV
        prevention, governance, and climate justice — empowering youth, women,
        adolescents, persons with disabilities, and rural communities through
        advocacy, education, and health promotion.
      </motion.p>

      {/* CTA Buttons */}
      <HeroButtons />

      {/* Trust badges */}
      <HeroTrustBadges />

      {/* Watch our story link */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.6}
      >
        <button
          className={cn(
            "inline-flex items-center gap-2.5 text-sm font-semibold text-neutral-600",
            "transition-colors duration-150 hover:text-primary-600",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-md"
          )}
          aria-label="Watch our story video"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-neutral-200 transition-shadow duration-150 hover:shadow-teal-sm">
            <Play size={14} className="ml-0.5 text-primary-500" aria-hidden="true" fill="currentColor" />
          </span>
          Watch Our Story
        </button>
      </motion.div>
    </div>
  );
}

// ─── HeroSection ─────────────────────────────────────────────────────────────

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      aria-label="Hero — RHARK mission and calls to action"
      className="relative overflow-hidden bg-gradient-to-br from-neutral-50 via-white to-primary-50/30"
    >
      {/* ── Decorative background shapes ── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Large teal circle — top right */}
        <div className="absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-primary-50 opacity-60" />
        {/* Amber accent circle — bottom left */}
        <div className="absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full bg-accent-50 opacity-50" />
        {/* Grid dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #0D6E6E 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* ── Content ── */}
      <div className="container-site relative z-10">
        <div className="grid min-h-[calc(100vh-5rem)] items-center gap-12 py-20 lg:grid-cols-2 lg:gap-16 lg:py-24">
          {/* Left — content */}
          <div className={cn("transition-opacity duration-700", inView ? "opacity-100" : "opacity-0")}>
            <HeroContent />
          </div>

          {/* Right — visual */}
          <div className="relative hidden lg:block">
            <HeroVisual />
          </div>
        </div>
      </div>

      {/* ── Mobile image strip ── */}
      <div className="relative h-72 w-full overflow-hidden lg:hidden" aria-hidden="true">
        <Image
          src="/images/logo/RHARK LOGO PNG.jpeg"
          alt=""
          fill
          className="object-contain p-6"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
      </div>

      {/* ── Bottom wave divider ── */}
      <div aria-hidden="true" className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full text-white"
          preserveAspectRatio="none"
        >
          <path
            d="M0 48h1440V24C1200 8 960 0 720 0S240 8 0 24v24z"
            fill="currentColor"
          />
        </svg>
      </div>
    </section>
  );
}
