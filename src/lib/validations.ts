import { z } from "zod";

// ─── Reusable Field Schemas ───────────────────────────────────────────────────

const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Please enter a valid email address");

const phoneSchema = z
  .string()
  .regex(/^(\+254|0)[17]\d{8}$/, "Please enter a valid Kenyan phone number")
  .optional()
  .or(z.literal(""));

const nameSchema = (field: string) =>
  z.string().min(2, `${field} must be at least 2 characters`).max(100, `${field} is too long`);

// ─── Contact Form ─────────────────────────────────────────────────────────────

export const contactSchema = z.object({
  name: nameSchema("Name"),
  email: emailSchema,
  phone: phoneSchema,
  organization: z.string().max(200, "Organization name is too long").optional().or(z.literal("")),
  subject: z.string().min(5, "Subject must be at least 5 characters").max(150),
  message: z.string().min(20, "Message must be at least 20 characters").max(2000),
  programOfInterest: z.string().max(200).optional().or(z.literal("")),
  inquiryType: z.enum(["general", "information", "partnership", "program"]).default("general"),
  // Honeypot field — must be empty (bots fill it, humans don't see it)
  _honeypot: z.string().max(0, "Invalid submission"),
});

export type ContactSchema = z.infer<typeof contactSchema>;

// ─── Newsletter Form ──────────────────────────────────────────────────────────

export const newsletterSchema = z.object({
  email: emailSchema,
  firstName: z.string().max(100).optional(),
});

export type NewsletterSchema = z.infer<typeof newsletterSchema>;

// ─── Volunteer Form ───────────────────────────────────────────────────────────

export const volunteerSchema = z.object({
  firstName: nameSchema("First name"),
  lastName: nameSchema("Last name"),
  email: emailSchema,
  phone: z.string().regex(/^(\+254|0)[17]\d{8}$/, "Please enter a valid Kenyan phone number"),
  county: z.string().min(1, "Please select your county"),
  skills: z.string().min(10, "Please describe your skills (min 10 characters)").max(500),
  availability: z.string().min(1, "Please select your availability"),
  motivation: z.string().min(30, "Please tell us why you want to volunteer (min 30 characters)").max(1000),
  _honeypot: z.string().max(0, "Invalid submission"),
});

export type VolunteerSchema = z.infer<typeof volunteerSchema>;

export const partnershipInquirySchema = z.object({
  organizationName: z.string().min(2, "Organization name is required").max(150),
  contactName: nameSchema("Contact name"),
  email: emailSchema,
  phone: phoneSchema,
  partnershipType: z.string().min(1, "Please select a partnership type"),
  message: z.string().min(30, "Message must be at least 30 characters").max(2000),
  _honeypot: z.string().max(0, "Invalid submission"),
});

export type PartnershipInquirySchema = z.infer<typeof partnershipInquirySchema>;

export const donationInquirySchema = z.object({
  donorName: nameSchema("Donor name"),
  email: emailSchema,
  phone: phoneSchema,
  amount: z.coerce.number().positive("Amount must be greater than zero").optional().or(z.literal("")),
  donationType: z.enum(["one-time", "monthly", "in-kind", "corporate"]),
  message: z.string().max(1000).optional(),
  _honeypot: z.string().max(0, "Invalid submission"),
});

export type DonationInquirySchema = z.infer<typeof donationInquirySchema>;

// ─── Donation Form ────────────────────────────────────────────────────────────

export const donationFormSchema = z.object({
  donorName: nameSchema("Donor name"),
  email: emailSchema,
  phone: z
    .string()
    .min(10, "Phone number is required")
    .regex(/^(\+254|0)[17]\d{8}$/, "Please enter a valid Kenyan phone number (e.g. 0712345678)"),
  amount: z.coerce.number().min(10, "Minimum donation is KES 10").max(10000000, "Maximum donation is KES 10,000,000"),
  paymentMethod: z.enum(["mpesa", "bank-transfer"], {
    errorMap: () => ({ message: "Please select a payment method" }),
  }),
  isRecurring: z.boolean().default(false),
  message: z.string().max(500, "Message is too long").optional().or(z.literal("")),
  _honeypot: z.string().max(0, "Invalid submission"),
});

export type DonationFormSchema = z.infer<typeof donationFormSchema>;

// ─── Admin Reply Form ─────────────────────────────────────────────────────────

export const adminReplySchema = z.object({
  contactId: z.string().min(1, "Contact ID is required"),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000, "Message is too long"),
});

export type AdminReplySchema = z.infer<typeof adminReplySchema>;

// ─── Admin Auth Schema ────────────────────────────────────────────────────────

export const adminLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type AdminLoginSchema = z.infer<typeof adminLoginSchema>;

// ─── M-Pesa Callback Schema ───────────────────────────────────────────────────

export const mpesaCallbackSchema = z.object({
  Body: z.object({
    stkCallback: z.object({
      MerchantRequestID: z.string(),
      CheckoutRequestID: z.string(),
      ResultCode: z.number(),
      ResultDesc: z.string(),
      CallbackMetadata: z
        .object({
          Item: z.array(
            z.object({
              Name: z.string(),
              Value: z.union([z.string(), z.number()]).optional(),
            })
          ),
        })
        .optional(),
    }),
  }),
});

export type MpesaCallbackSchema = z.infer<typeof mpesaCallbackSchema>;