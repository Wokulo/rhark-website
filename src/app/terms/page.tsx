import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import Link from "next/link";
export const metadata: Metadata = buildMetadata({ title: "Terms of Use", path: "/terms" });
export default function TermsPage() {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 py-20 lg:py-28" aria-labelledby="terms-heading">
        <div className="container-site text-center">
          <h1 id="terms-heading" className="font-display text-4xl font-extrabold text-white">Terms of Use</h1>
          <p className="mt-3 text-primary-200">Last updated: January 2025</p>
        </div>
      </section>
      <section className="py-16 lg:py-20">
        <div className="container-site max-w-3xl space-y-8 text-base leading-relaxed text-neutral-600">
          <div><h2 className="font-display text-xl font-bold text-neutral-900">1. Acceptance of Terms</h2><p className="mt-3">By accessing and using the RHARK website, you accept and agree to be bound by these Terms of Use. If you do not agree, please do not use this website.</p></div>
          <div><h2 className="font-display text-xl font-bold text-neutral-900">2. Use of Content</h2><p className="mt-3">All content on this website is the property of RHARK unless otherwise stated. You may share our content for non-commercial purposes with proper attribution. Commercial use requires written permission.</p></div>
          <div><h2 className="font-display text-xl font-bold text-neutral-900">3. Disclaimer</h2><p className="mt-3">The information on this website is provided for general informational purposes only. RHARK makes no warranties about the completeness, accuracy, or reliability of the information.</p></div>
          <div><h2 className="font-display text-xl font-bold text-neutral-900">4. External Links</h2><p className="mt-3">Our website may contain links to external websites. RHARK is not responsible for the content or privacy practices of those sites.</p></div>
          <div><h2 className="font-display text-xl font-bold text-neutral-900">5. Contact</h2><p className="mt-3">For questions about these terms, contact us at <a href="mailto:info@rhark.org" className="text-primary-600 hover:underline">info@rhark.org</a>.</p></div>
          <Link href="/" className="inline-block text-sm font-semibold text-primary-600 hover:underline">← Back to Home</Link>
        </div>
      </section>
    </div>
  );
}
