import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
export const metadata: Metadata = buildMetadata({ title: "Accessibility Statement", path: "/accessibility" });
const FEATURES = ["Keyboard navigation throughout the entire website","Skip to main content link on every page","ARIA labels and roles on all interactive elements","Sufficient colour contrast ratios (WCAG 2.2 AA)","Descriptive alt text on all images","Visible focus indicators for keyboard users","Responsive design for all screen sizes","Screen reader compatible markup","No content conveyed by colour alone","Form error messages linked to their fields"];
export default function AccessibilityPage() {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 py-20 lg:py-28" aria-labelledby="a11y-heading">
        <div className="container-site text-center">
          <h1 id="a11y-heading" className="font-display text-4xl font-extrabold text-white">Accessibility Statement</h1>
          <p className="mt-3 text-primary-200">RHARK is committed to digital accessibility for all users.</p>
        </div>
      </section>
      <section className="py-16 lg:py-20">
        <div className="container-site max-w-3xl space-y-8 text-base leading-relaxed text-neutral-600">
          <div><h2 className="font-display text-xl font-bold text-neutral-900">Our Commitment</h2><p className="mt-3">RHARK is committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone and apply relevant accessibility standards, targeting WCAG 2.2 Level AA compliance.</p></div>
          <div>
            <h2 className="font-display text-xl font-bold text-neutral-900">Accessibility Features</h2>
            <ul className="mt-4 space-y-2" role="list">
              {FEATURES.map((f) => (<li key={f} className="flex items-start gap-2 text-sm"><CheckCircle2 size={15} className="mt-0.5 shrink-0 text-primary-500" aria-hidden="true" />{f}</li>))}
            </ul>
          </div>
          <div><h2 className="font-display text-xl font-bold text-neutral-900">Known Limitations</h2><p className="mt-3">We are continuously working to improve accessibility. Some older PDF documents may not be fully accessible. We are working to remediate these.</p></div>
          <div><h2 className="font-display text-xl font-bold text-neutral-900">Feedback</h2><p className="mt-3">If you experience any accessibility barriers on our website, please contact us at <a href="mailto:info@rhark.org" className="text-primary-600 hover:underline">info@rhark.org</a>. We aim to respond within 5 business days.</p></div>
          <Link href="/" className="inline-block text-sm font-semibold text-primary-600 hover:underline">← Back to Home</Link>
        </div>
      </section>
    </div>
  );
}
