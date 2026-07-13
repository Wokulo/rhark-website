import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import Link from "next/link";
export const metadata: Metadata = buildMetadata({ title: "Privacy Policy", noIndex: false, path: "/privacy" });
export default function PrivacyPage() {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 py-20 lg:py-28" aria-labelledby="privacy-heading">
        <div className="container-site text-center">
          <h1 id="privacy-heading" className="font-display text-4xl font-extrabold text-white">Privacy Policy</h1>
          <p className="mt-3 text-primary-200">Last updated: January 2025</p>
        </div>
      </section>
      <section className="py-16 lg:py-20">
        <div className="container-site max-w-3xl">
          <div className="prose prose-neutral max-w-none space-y-8 text-base leading-relaxed text-neutral-600">
            <div>
              <h2 className="font-display text-xl font-bold text-neutral-900">1. Introduction</h2>
              <p className="mt-3">Reproductive Health Action and Rights Kenya (RHARK) is committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and protect your data in compliance with the Kenya Data Protection Act 2019.</p>
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-neutral-900">2. Information We Collect</h2>
              <p className="mt-3">We may collect the following types of information:</p>
              <ul className="mt-3 ml-5 list-disc space-y-2">
                <li>Contact information (name, email address, phone number) when you submit a form</li>
                <li>Newsletter subscription data (email address)</li>
                <li>Volunteer and internship application data</li>
                <li>Website usage data (via analytics cookies, with your consent)</li>
              </ul>
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-neutral-900">3. How We Use Your Information</h2>
              <p className="mt-3">We use your information to respond to enquiries, send newsletters (with your consent), process volunteer applications, and improve our website and services. We do not sell or share your personal data with third parties for marketing purposes.</p>
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-neutral-900">4. Data Security</h2>
              <p className="mt-3">We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, alteration, disclosure, or destruction.</p>
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-neutral-900">5. Your Rights</h2>
              <p className="mt-3">Under the Kenya Data Protection Act 2019, you have the right to access, correct, or delete your personal data. To exercise these rights, contact us at <a href="mailto:info@rhark.org" className="text-primary-600 hover:underline">info@rhark.org</a>.</p>
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-neutral-900">6. Contact</h2>
              <p className="mt-3">For privacy-related enquiries, contact our Data Protection Officer at <a href="mailto:info@rhark.org" className="text-primary-600 hover:underline">info@rhark.org</a>.</p>
            </div>
          </div>
          <div className="mt-10">
            <Link href="/" className="text-sm font-semibold text-primary-600 hover:underline">← Back to Home</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
