"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Heart, ArrowRight, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { donationFormSchema, type DonationFormSchema } from "@/lib/validations";
import { ORG } from "@/constants";
import { cn, formatNumber } from "@/utils";
import { Button, Input, Textarea, Alert } from "@/components/ui";

const DONATION_AMOUNTS = [500, 1000, 2500, 5000, 10000];

const IMPACT = [
  { amount: "KES 500", impact: "Provides SRHR educational materials for 5 youth" },
  { amount: "KES 1,000", impact: "Funds a community health volunteer training session" },
  { amount: "KES 2,500", impact: "Supports a mental health peer support group for one month" },
  { amount: "KES 5,000", impact: "Covers transport and supplies for a community outreach day" },
  { amount: "KES 10,000", impact: "Sponsors a youth gender equality workshop for 30 participants" },
];

export default function DonatePage() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");
  const [donationResult, setDonationResult] = useState<{
    id: string;
    transactionId: string;
    checkoutRequestId?: string;
    status: string;
    message: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
    reset,
    setValue,
    watch,
  } = useForm<DonationFormSchema>({
    resolver: zodResolver(donationFormSchema),
    mode: "onBlur",
    defaultValues: {
      donorName: "",
      email: "",
      phone: "",
      amount: 1000,
      paymentMethod: "mpesa",
      isRecurring: false,
      message: "",
    },
  });

  const selectedAmount = watch("amount");
  const paymentMethod = watch("paymentMethod");

  const onSubmit = async (data: DonationFormSchema) => {
    setServerError("");
    setDonationResult(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Donation failed. Please try again.");
      }

      setDonationResult(result.data);
      setSubmitted(true);
      reset();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDonateAnother = () => {
    setSubmitted(false);
    setDonationResult(null);
    setServerError("");
    reset({
      donorName: "",
      email: "",
      phone: "",
      amount: 1000,
      paymentMethod: "mpesa",
      isRecurring: false,
      message: "",
    });
  };

  if (submitted && donationResult) {
    return (
      <div className="bg-white">
        <section className="bg-gradient-to-br from-accent-500 to-accent-700 py-24 lg:py-32" aria-labelledby="donate-hero-heading">
          <div className="container-site text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
              <Heart size={30} className="text-white" aria-hidden="true" fill="currentColor" />
            </div>
            <h1 id="donate-hero-heading" className="font-display text-4xl font-extrabold text-white text-balance lg:text-5xl">
              Support Our Mission
            </h1>
          </div>
        </section>

        <section className="py-20 lg:py-28" aria-labelledby="donate-success-heading">
          <div className="container-site max-w-2xl">
            <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-neutral-200">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success-50">
                  <CheckCircle2 size={32} className="text-success-500" aria-hidden="true" />
                </div>
                <h2 id="donate-success-heading" className="font-display text-2xl font-bold text-neutral-900">
                  {donationResult.status === "pending" ? "Donation Initiated!" : "Donation Received!"}
                </h2>
                <p className="text-neutral-600">
                  {donationResult.message}
                </p>

                {donationResult.checkoutRequestId && (
                  <div className="mt-4 w-full rounded-xl bg-neutral-50 p-4 text-left">
                    <p className="text-sm font-semibold text-neutral-700">Transaction Reference</p>
                    <p className="mt-1 font-mono text-sm text-neutral-900">{donationResult.transactionId}</p>
                    <p className="mt-2 text-sm text-neutral-500">
                      Please save this reference for your records. A confirmation email will be sent shortly.
                    </p>
                  </div>
                )}

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Button onClick={handleDonateAnother} size="lg">
                    Make Another Donation
                  </Button>
                  <Button href="/" variant="secondary" size="lg">
                    Return Home
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-accent-500 to-accent-700 py-24 lg:py-32" aria-labelledby="donate-hero-heading">
        <div className="container-site text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
            <Heart size={30} className="text-white" aria-hidden="true" fill="currentColor" />
          </div>
          <h1 id="donate-hero-heading" className="font-display text-4xl font-extrabold text-white text-balance lg:text-5xl">
            Support Our Mission
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/85">
            Your donation funds life-changing SRHR programmes, mental health services, and youth empowerment initiatives in Siaya County.
          </p>
        </div>
      </section>

      <section className="py-20 lg:py-28" aria-labelledby="donate-content-heading">
        <div className="container-site grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <h2 id="donate-content-heading" className="font-display text-2xl font-bold text-neutral-900">
              Make a Donation
            </h2>
            <p className="mt-2 text-base text-neutral-600">
              Choose an amount and payment method below. All donations are secure and tax-deductible.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5" noValidate>
              <input type="text" {...register("_honeypot")} className="sr-only" tabIndex={-1} aria-hidden="true" autoComplete="off" />

              <Input
                label="Full Name"
                error={errors.donorName?.message}
                required
                leftIcon={<span className="text-sm font-medium text-neutral-400">👤</span>}
                {...register("donorName")}
              />

              <Input
                label="Email Address"
                type="email"
                error={errors.email?.message}
                required
                leftIcon={<span className="text-sm font-medium text-neutral-400">✉</span>}
                {...register("email")}
              />

              <Input
                label="Phone Number"
                type="tel"
                error={errors.phone?.message}
                required
                hint="M-Pesa requires a Kenyan phone number (e.g. 0712345678)"
                leftIcon={<span className="text-sm font-medium text-neutral-400">📱</span>}
                {...register("phone")}
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-neutral-700">
                  Donation Amount <span className="ml-1 text-error-500" aria-hidden="true">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {DONATION_AMOUNTS.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setValue("amount", amount, { shouldValidate: true, shouldDirty: true })}
                      className={cn(
                        "rounded-xl border-2 px-3 py-2.5 text-sm font-bold transition-all",
                        selectedAmount === amount && !errors.amount
                          ? "border-primary-500 bg-primary-50 text-primary-700"
                          : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300"
                      )}
                    >
                      KES {amount.toLocaleString()}
                    </button>
                  ))}
                </div>
                {errors.amount && (
                  <p role="alert" className="flex items-center gap-1 text-xs text-error-500">
                    <span aria-hidden="true">⚠</span> {errors.amount.message}
                  </p>
                )}
                <Input
                  type="number"
                  error={errors.amount?.message}
                  {...register("amount", { valueAsNumber: true })}
                  className="mt-2"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-neutral-700">
                  Payment Method <span className="ml-1 text-error-500" aria-hidden="true">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-all",
                      paymentMethod === "mpesa"
                        ? "border-primary-500 bg-primary-50"
                        : "border-neutral-200 bg-white hover:border-neutral-300"
                    )}
                  >
                    <input
                      type="radio"
                      value="mpesa"
                      {...register("paymentMethod")}
                      className="h-4 w-4 text-primary-500"
                    />
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">M-Pesa</p>
                      <p className="text-xs text-neutral-500">Pay instantly via STK Push</p>
                    </div>
                  </label>
                  <label
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-all",
                      paymentMethod === "bank-transfer"
                        ? "border-primary-500 bg-primary-50"
                        : "border-neutral-200 bg-white hover:border-neutral-300"
                    )}
                  >
                    <input
                      type="radio"
                      value="bank-transfer"
                      {...register("paymentMethod")}
                      className="h-4 w-4 text-primary-500"
                    />
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">Bank Transfer</p>
                      <p className="text-xs text-neutral-500">Direct bank deposit</p>
                    </div>
                  </label>
                </div>
                {errors.paymentMethod && (
                  <p role="alert" className="flex items-center gap-1 text-xs text-error-500">
                    <span aria-hidden="true">⚠</span> {errors.paymentMethod.message}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <input
                  id="isRecurring"
                  type="checkbox"
                  {...register("isRecurring")}
                  className="h-4 w-4 rounded border-neutral-300 text-primary-500 focus:ring-primary-500"
                />
                <label htmlFor="isRecurring" className="text-sm text-neutral-700">
                  Make this a monthly recurring donation
                </label>
              </div>

              <Textarea
                label="Message (Optional)"
                error={errors.message?.message}
                hint="Add a personal note or dedication"
                rows={3}
                {...register("message")}
              />

              {serverError && (
                <Alert variant="error" title="Submission Error">
                  {serverError}
                </Alert>
              )}

              <Button
                type="submit"
                size="lg"
                isLoading={isSubmitting}
                disabled={!isValid || isSubmitting}
                className="w-full"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                    Processing…
                  </>
                ) : (
                  <>
                    <Heart size={18} aria-hidden="true" />
                    Donate Now
                  </>
                )}
              </Button>
            </form>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold text-neutral-900">Your Impact</h2>
            <p className="mt-2 text-base text-neutral-600">
              Every contribution — no matter the size — makes a real difference in the lives of communities in Siaya County.
            </p>
            <ul className="mt-8 space-y-4" role="list">
              {IMPACT.map((item) => (
                <li key={item.amount} className="flex items-start gap-4 rounded-2xl bg-neutral-50 p-5 ring-1 ring-neutral-200">
                  <div className="flex h-12 w-20 shrink-0 items-center justify-center rounded-xl bg-accent-500 text-sm font-extrabold text-white">
                    {item.amount}
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="shrink-0 text-success-500" aria-hidden="true" />
                    <p className="text-sm text-neutral-700">{item.impact}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-2xl bg-primary-50 p-6 ring-1 ring-primary-100">
              <p className="text-sm font-semibold text-neutral-700">Secure Donations</p>
              <p className="mt-1 text-sm text-neutral-500">
                All transactions are processed securely. Your data is protected and never shared with third parties.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
