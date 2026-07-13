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
  subject: z.string().min(5, "Subject must be at least 5 characters").max(150),
  message: z.string().min(20, "Message must be at least 20 characters").max(2000),
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
