"use client";

import { useRef, useState, useEffect, useCallback, memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Heart,
  Users,
  Brain,
  Shield,
  Leaf,
  Landmark,
  Play,
  X,
} from "lucide-react";
import { cn } from "@/utils";
import { ROUTES, ORG } from "@/constants";

// ─── Animation Variants ───────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94], delay },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: { duration: 0.4, delay },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: (delay = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1], delay },
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

// Hero images that exist on disk — static array for slideshow rotation
const HERO_IMAGES = [
  "/images/hero/DSC_0878.JPG",
  "/images/hero/photo_2026-07-26_20-07-27.jpg",
  "/images/hero/photo_2025-11-13_09-32-11.jpg",
  "/images/hero/IMG-20250212-WA0153.jpg",
  "/images/hero/IMG-20250131-WA0044.jpg",
  "/images/hero/IMG-20250130-WA0175.jpg",
  "/images/hero/IMG-20250130-WA0164.jpg",
  "/images/hero/IMG-20250129-WA0062.jpg",
  "/images/hero/hunkgraphy -9019.jpg",
  "/images/hero/hunkgraphy -8992.jpg",
  "/images/hero/DSC_1827.jpg",
  "/images/hero/DSC_0849.JPG",
  "/images/hero/DSC_0239.JPG",
  "/images/hero/DSC_0230.JPG",
  "/images/hero/DSC_0226.JPG",
  "/images/hero/DSC_0222.JPG",
];

const HERO_ALT = "RHARK community members in Siaya County";

// Video file that exists on disk
const STORY_VIDEO = "/videos/rhark-story.mp4";

const KEN_BURNS = [
  { scale: 1.03, x: 0, y: 0 },
  { scale: 1.06, x: 50, y: 0 },
  { scale: 1.03, x: 0, y: 50 },
  { scale: 1.04, x: 50, y: 50 },
];

// ─── VideoModal ───────────────────────────────────────────────────────────────

const VideoModal = memo(function VideoModal({ onClose }: { onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  // Autoplay when modal mounts
  useEffect(() => {
    videoRef.current?.play().catch(() => {
      // Autoplay blocked by browser — user can press play manually
    });
  }, []);

  // Prevent background scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // ESC to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Focus trap — keep focus inside modal
  useEffect(() => {
    const el = backdropRef.current;
    if (!el) return;
    const focusable = el.querySelectorAll<HTMLElement>(
      "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();
    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", trap);
    return () => document.removeEventListener("keydown", trap);
  }, []);

  return (
    <div
      ref={backdropRef}
      role="dialog"
      aria-modal="true"
      aria-label="Watch Our Story video"
      className="fixed inset-0 z-[900] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-3xl rounded-2xl overflow-hidden bg-black shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close video"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <X size={18} aria-hidden="true" />
        </button>

        {/* Video player */}
        <video
          ref={videoRef}
          src={STORY_VIDEO}
          controls
          playsInline
          className="w-full aspect-video"
          aria-label="RHARK Our Story video"
        />
      </div>
    </div>
  );
});

// ─── FloatingInfoCard ─────────────────────────────────────────────────────────

const FloatingInfoCard = memo(function FloatingInfoCard({
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
        "absolute flex items-center gap-2.5 rounded-[1.35rem] border border-white/70 bg-white/80 px-3.5 py-2.5 backdrop-blur-xl",
        "shadow-[0_18px_48px_rgba(15,23,42,0.12)]",
        className
      )}
    >
      <div
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
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
});

// ─── HeroSlideshow ──────────────────────────────────────────────────────────────

const HeroSlideshow = memo(function HeroSlideshow({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [images.length]);

  const kb = KEN_BURNS[current % KEN_BURNS.length];

  return (
    <div className="relative h-full w-full overflow-hidden">
      <AnimatePresence>
        <motion.div
          key={current}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
        >
          <motion.div
            className="relative h-full w-full"
            initial={{ scale: kb.scale, x: `${kb.x}%`, y: `${kb.y}%` }}
            animate={{ scale: kb.scale + 0.03 }}
            transition={{
              duration: 10,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <Image
              src={images[current]}
              alt={HERO_ALT}
              fill
              className="object-cover object-center"
              quality={90}
              priority={current === 0}
              sizes="(max-width: 768px) 100vw, 50vw"
              loading={current === 0 ? "eager" : "lazy"}
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
});

// ─── HeroVisual ───────────────────────────────────────────────────────────────

const HeroVisual = memo(function HeroVisual() {
  return (
    <div className="relative flex items-center justify-center">
      {/* Decorative background blob — z-[1], behind everything */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        custom={0.2}
        className="absolute -inset-12 z-[1] rounded-[3rem] bg-[radial-gradient(circle_at_top,rgba(13,110,110,0.16),transparent_42%),linear-gradient(135deg,rgba(13,110,110,0.08),rgba(245,158,11,0.12))] opacity-90 blur-2xl"
        aria-hidden="true"
      />

      {/* Main image container — z-10, holds slideshow */}
      <motion.div
        variants={scaleIn}
        initial="hidden"
        animate="visible"
        custom={0.3}
        className="relative z-10 w-full max-w-xl overflow-hidden rounded-[2.2rem] border border-white/70 shadow-[0_34px_90px_rgba(15,23,42,0.18)]"
      >
        {/* aspect-[4/5] wrapper — slides fill it */}
        <div className="relative aspect-[4/5] w-full">
          <HeroSlideshow images={HERO_IMAGES} />

          {/* Gradient overlay for text legibility — z-20 */}
          <div
            className="absolute inset-0 z-20 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.25),transparent_42%),linear-gradient(to_top,rgba(13,110,110,0.55),transparent_60%)]"
            aria-hidden="true"
          />

          {/* Bottom caption bar — z-30, above gradient */}
          <div className="absolute bottom-0 left-0 right-0 z-30 p-5">
            <div className="rounded-[1.1rem] border border-white/20 bg-white/10 p-4 backdrop-blur-md">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/80">
                Our Community
              </p>
              <p className="mt-1 text-sm font-bold text-white">
                Empowering lives in Siaya County
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating programme cards — z-30, above image container */}
      <FloatingInfoCard
        icon={FLOATING_CARDS[0].icon}
        label={FLOATING_CARDS[0].label}
        color={FLOATING_CARDS[0].color}
        delay={FLOATING_CARDS[0].delay}
        className="-left-6 top-12 lg:-left-12 z-30"
      />
      <FloatingInfoCard
        icon={FLOATING_CARDS[1].icon}
        label={FLOATING_CARDS[1].label}
        color={FLOATING_CARDS[1].color}
        delay={FLOATING_CARDS[1].delay}
        className="-right-4 top-24 lg:-right-10 z-30"
      />
      <FloatingInfoCard
        icon={FLOATING_CARDS[2].icon}
        label={FLOATING_CARDS[2].label}
        color={FLOATING_CARDS[2].color}
        delay={FLOATING_CARDS[2].delay}
        className="-left-4 bottom-32 lg:-left-10 z-30"
      />
      <FloatingInfoCard
        icon={FLOATING_CARDS[3].icon}
        label={FLOATING_CARDS[3].label}
        color={FLOATING_CARDS[3].color}
        delay={FLOATING_CARDS[3].delay}
        className="-right-2 bottom-20 lg:-right-8 z-30"
      />

      {/* Decorative circles — z-[2], behind image container */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        custom={0.4}
        className="absolute -right-4 -top-4 z-[2] h-20 w-20 rounded-full bg-accent-100/80 blur-sm"
        aria-hidden="true"
      />
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        custom={0.5}
        className="absolute -bottom-8 -left-8 z-[2] h-36 w-36 rounded-full bg-primary-100/70 blur-sm"
        aria-hidden="true"
      />
    </div>
  );
});

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
          "inline-flex items-center gap-2 rounded-full bg-primary-500 px-5 py-3 text-sm font-bold text-white shadow-teal",
          "transition-all duration-200 hover:bg-primary-500 hover:shadow-teal hover:-translate-y-0.5",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        )}
      >
        Learn About RHARK
        <ArrowRight size={16} aria-hidden="true" />
      </Link>

      <Link
        href={ROUTES.programmes}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white/70 px-5 py-3 text-sm font-bold text-primary-600 backdrop-blur-sm",
          "transition-all duration-200 hover:border-primary-300 hover:bg-primary-50/90 hover:-translate-y-0.5 hover:shadow-md",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        )}
      >
        <Landmark size={16} aria-hidden="true" />
        Explore Our Programs
      </Link>

      <Link
        href={ROUTES.donate}
        className={cn(
          "inline-flex items-center gap-2 rounded-full bg-accent-500 px-5 py-3 text-sm font-bold text-white shadow-[0_16px_36px_rgba(245,158,11,0.28)]",
          "transition-all duration-200 hover:bg-accent-600 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(245,158,11,0.32)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2"
        )}
      >
        <Heart size={16} aria-hidden="true" fill="currentColor" />
        Support Our Mission
      </Link>
    </motion.div>
  );
}

// ─── HeroContent ──────────────────────────────────────────────────────────────

const HeroContent = memo(function HeroContent({ onWatchStory }: { onWatchStory: () => void }) {
  return (
    <div className="flex flex-col gap-5">
      {/* Eyebrow label */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.1}
      >
        <span className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-[11px] font-semibold tracking-wide text-primary-500 ring-1 ring-primary-100">
          <span
            className="h-1.5 w-1.5 rounded-full bg-primary-400 animate-pulse-soft"
            aria-hidden="true"
          />
          Community-Based Organization · Since {ORG.founded}
        </span>
      </motion.div>

      {/* Main heading */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.2}>
        <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-neutral-800 text-balance sm:text-5xl lg:text-6xl">
          Empowering{" "}
          <span className="text-gradient">Communities.</span>
          <br />
          <span className="text-primary-500">Advancing</span> Sexual &
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
        className="max-w-xl text-sm leading-relaxed text-neutral-500 sm:text-base lg:text-[17px]"
      >
        RHARK is a community-based organization in{" "}
        <strong className="font-semibold text-neutral-600">
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
      <div className="grid max-w-xl grid-cols-3 gap-3 pt-2 sm:pt-3">
        <div className="rounded-[1.35rem] border border-white/70 bg-white/80 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur-sm">
          <h3 className="text-2xl font-bold text-primary-500">10K+</h3>
          <p className="text-xs text-neutral-500">People Reached</p>
        </div>
        <div className="rounded-[1.35rem] border border-white/70 bg-white/80 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur-sm">
          <h3 className="text-2xl font-bold text-primary-500">50+</h3>
          <p className="text-xs text-neutral-500">Activities</p>
        </div>
        <div className="rounded-[1.35rem] border border-white/70 bg-white/80 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur-sm">
          <h3 className="text-2xl font-bold text-primary-500">5+</h3>
          <p className="text-xs text-neutral-500">Partners</p>
        </div>
      </div>

      {/* Watch our story button — opens modal */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.6}
      >
        <button
          type="button"
          onClick={onWatchStory}
          className={cn(
            "inline-flex items-center gap-2.5 rounded-full px-1.5 text-sm font-semibold text-neutral-600",
            "transition-colors duration-150 hover:text-primary-600",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          )}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-neutral-200 transition-shadow duration-150 hover:shadow-teal-sm">
            <Play
              size={14}
              className="ml-0.5 text-primary-500"
              aria-hidden="true"
              fill="currentColor"
            />
          </span>
          Watch Our Story
        </button>
      </motion.div>
    </div>
  );
});

// ─── HeroSection ─────────────────────────────────────────────────────────────

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [videoOpen, setVideoOpen] = useState(false);

  const openVideo = useCallback(() => setVideoOpen(true), []);
  const closeVideo = useCallback(() => setVideoOpen(false), []);

  return (
    <>
      <section
        ref={ref}
        aria-label="Hero — RHARK mission and calls to action"
        className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(13,110,110,0.12),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(245,158,11,0.12),transparent_22%),linear-gradient(180deg,#f8fbfb_0%,#ffffff_55%,#f7faf9_100%)]"
      >
        {/* ── Decorative background shapes ── */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-primary-100/60 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full bg-accent-100/50 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "radial-gradient(circle, #0D6E6E 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          />
        </div>

        {/* ── Content ── */}
        <div className="container-site relative z-10">
          <div className="grid min-h-[86svh] items-center gap-10 py-12 lg:grid-cols-2 lg:gap-14 lg:py-16">
            {/* Left — content */}
            <div className={cn("transition-opacity duration-700", inView ? "opacity-100" : "opacity-0")}>
              <HeroContent onWatchStory={openVideo} />
            </div>

            {/* Right — visual */}
            <div className="relative hidden lg:block">
              <HeroVisual />
            </div>
          </div>
        </div>

        {/* ── Mobile image strip ── */}
        <div className="relative h-64 w-full overflow-hidden lg:hidden" aria-hidden="true">
          <HeroSlideshow images={HERO_IMAGES} />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/35 to-transparent" />
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

      {/* ── Video Modal ── */}
      {videoOpen && <VideoModal onClose={closeVideo} />}
    </>
  );
}
