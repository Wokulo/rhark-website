import nodemailer from "nodemailer";
import type { EmailTemplateType } from "@/types";

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export interface EmailTemplateData {
  name: string;
  email: string;
  [key: string]: unknown;
}

/**
 * Creates a reusable Nodemailer transporter.
 * Falls back to a JSON-logging transport when SMTP is not configured
 * (useful for development / preview deployments).
 */
function getTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    return nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT) || 587,
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  }

  // Fallback: log to console in development so we can test without real SMTP
  if (process.env.NODE_ENV === "development") {
    console.warn("[Email] SMTP not configured \u2014 Email sending is simulated.");
    return nodemailer.createTransport({
      name: "smtp-ethereal",
      host: "127.0.0.1",
      port: 587,
      auth: { user: "test", pass: "test" },
    });
  }

  throw new Error(
    "SMTP is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS in environment variables."
  );
}

/**
 * Send an email using the configured SMTP transport.
 * Returns `{ success: true }` on success, or throws on failure.
 */
export async function sendEmail(options: EmailOptions): Promise<{ success: true }> {
  const transporter = getTransporter();
  const smtpUser = process.env.SMTP_USER || "noreply@rhark.org";
  const from = process.env.SMTP_FROM || '"RHARK Website" <' + smtpUser + '>';

  await transporter.sendMail({
    from,
    to: options.to,
    subject: options.subject,
    html: options.html,
    replyTo: options.replyTo,
  });

  return { success: true };
}

// ─── Template builders ─────────────────────────────────────────────────────────

/**
 * Builds an HTML email with a consistent RHARK-branded layout.
 */
export function buildEmailHtml(bodyHtml: string): string {
  return [
    '<!DOCTYPE html>',
    '<html lang="en">',
    '<head>',
    '  <meta charset="UTF-8" />',
    '  <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
    '  <style>',
    '    body { margin:0; padding:0; background:#f4f4f6; font-family: "Segoe UI", system-ui, -apple-system, sans-serif; }',
    '    .wrapper { max-width:600px; margin:0 auto; padding:24px; }',
    '    .card { background:#ffffff; border-radius:16px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); overflow:hidden; }',
    '    .header { background: linear-gradient(135deg, #0f766e, #115e59); padding:24px 32px; }',
    '    .header h1 { margin:0; color:#ffffff; font-size:20px; font-weight:700; }',
    '    .header p { margin:4px 0 0; color:#ccfbf1; font-size:14px; }',
    '    .body { padding:24px 32px; }',
    '    .body p { color:#374151; font-size:15px; line-height:1.6; margin:0 0 16px; }',
    '    .field { margin-bottom:12px; }',
    '    .field-label { font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:#6b7280; margin-bottom:2px; }',
    '    .field-value { font-size:15px; color:#111827; background:#f9fafb; padding:8px 12px; border-radius:8px; }',
    '    .footer { padding:16px 32px 24px; border-top:1px solid #e5e7eb; text-align:center; }',
    '    .footer p { margin:0; color:#9ca3af; font-size:12px; }',
    '    .badge { display:inline-block; background:#d1fae5; color:#065f46; font-size:12px; font-weight:600; padding:4px 10px; border-radius:99px; }',
    '    .badge-error { display:inline-block; background:#fee2e2; color:#991b1b; font-size:12px; font-weight:600; padding:4px 10px; border-radius:99px; }',
    '    .badge-info { display:inline-block; background:#dbeafe; color:#1e40af; font-size:12px; font-weight:600; padding:4px 10px; border-radius:99px; }',
    '    hr { border:none; border-top:1px solid #e5e7eb; margin:16px 0; }',
    '    .button { display:inline-block; background:#0f766e; color:#ffffff !important; text-decoration:none; padding:12px 24px; border-radius:8px; font-weight:600; font-size:14px; }',
    '    .button:hover { background:#115e59; }',
    '    .receipt-table { width:100%; border-collapse:collapse; margin:16px 0; }',
    '    .receipt-table td { padding:8px 12px; border-bottom:1px solid #e5e7eb; font-size:14px; }',
    '    .receipt-table td:first-child { font-weight:600; color:#6b7280; width:40%; }',
    '    .receipt-table td:last-child { color:#111827; }',
    '  </style>',
    '</head>',
    '<body>',
    '  <div class="wrapper">',
    '    <div class="card">',
    '      <div class="header">',
    '        <h1>RHARK</h1>',
    '        <p>Reproductive Health Action and Rights Kenya</p>',
    '      </div>',
    '      <div class="body">',
    bodyHtml,
    '      </div>',
    '      <div class="footer">',
    '        <p>RHARK \u2022 Bondo, Siaya County, Kenya \u2022 info@rhark.org</p>',
    '        <p style="margin-top:4px;">\u00a9 ' + new Date().getFullYear() + ' RHARK. All rights reserved.</p>',
    '        <p style="margin-top:4px;">',
    '          <a href="https://www.rhark.org" style="color:#0f766e; text-decoration:underline;">www.rhark.org</a>',
    '        </p>',
    '      </div>',
    '    </div>',
    '  </div>',
    '</body>',
    '</html>',
  ].join("\n");
}

/**
 * Build a notification email for the RHARK team when a form is submitted.
 */
export function buildAdminNotificationHtml(
  formType: string,
  fields: Record<string, string>
): string {
  const fieldRows = Object.entries(fields)
    .filter(([key]) => !key.startsWith("_")) // skip honeypot / internal fields
    .map(([key, value]) => {
      const label = key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (s) => s.toUpperCase())
        .trim();
      return [
        '<div class="field">',
        '  <div class="field-label">' + escapeHtml(label) + "</div>",
        '  <div class="field-value">' + escapeHtml(value || "(not provided)") + "</div>",
        "</div>",
      ].join("\n");
    })
    .join("\n");

  return [
    "<p>You received a new <strong>" + escapeHtml(formType) + "</strong> submission.</p>",
    '<p style="margin-top:16px;"><span class="badge">New Submission</span></p>',
    "<hr />",
    fieldRows,
    "<hr />",
    '<p style="font-size:13px; color:#6b7280;">',
    "Log in to the admin panel to view all submissions and send responses.",
    "</p>",
  ].join("\n");
}

/**
 * Build an auto-reply acknowledgment email for the person who submitted the form.
 */
export function buildAutoReplyHtml(
  name: string,
  formType: string,
  message: string
): string {
  return [
    "<p>Dear <strong>" + escapeHtml(name) + "</strong>,</p>",
    "<p>Thank you for reaching out to RHARK through our website.</p>",
    "<p>" + escapeHtml(message) + "</p>",
    "<p>Best regards,</p>",
    "<p><strong>The RHARK Team</strong></p>",
  ].join("\n");
}

// ─── Donation Email Templates ──────────────────────────────────────────────────

/**
 * Donation thank-you email sent to donor after successful payment.
 */
export function buildDonationThankYouHtml(
  donorName: string,
  amount: number,
  transactionId: string,
  paymentMethod: string
): string {
  return [
    "<p>Dear <strong>" + escapeHtml(donorName) + "</strong>,</p>",
    "<p>Thank you for your generous donation to RHARK!</p>",
    '<p style="font-size:18px; text-align:center; padding:16px; background:#f0fdf4; border-radius:8px;">',
    '  <strong>KES ' + amount.toLocaleString("en-KE") + "</strong>",
    "</p>",
    "<p>Your support helps us continue our vital work in Sexual and Reproductive Health and Rights, gender equality, and youth empowerment in Siaya County, Kenya.</p>",
    "<hr />",
    '<table class="receipt-table">',
    "  <tr><td>Transaction ID</td><td>" + escapeHtml(transactionId) + "</td></tr>",
    "  <tr><td>Amount</td><td>KES " + amount.toLocaleString("en-KE") + "</td></tr>",
    "  <tr><td>Payment Method</td><td>" + escapeHtml(paymentMethod) + "</td></tr>",
    "  <tr><td>Date</td><td>" + new Date().toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" }) + "</td></tr>",
    "</table>",
    "<hr />",
    "<p>You will receive a formal receipt via email shortly. If you have any questions, please contact us at info@rhark.org.</p>",
    "<p>With gratitude,</p>",
    "<p><strong>The RHARK Team</strong></p>",
  ].join("\n");
}

/**
 * Donation receipt email with full transaction details.
 */
export function buildDonationReceiptHtml(
  donorName: string,
  amount: number,
  transactionId: string,
  paymentMethod: string,
  mpesaReceiptNumber?: string
): string {
  return [
    "<p>Dear <strong>" + escapeHtml(donorName) + "</strong>,</p>",
    "<p>This is your official donation receipt from RHARK.</p>",
    '<p><span class="badge">Donation Receipt</span></p>',
    "<hr />",
    '<table class="receipt-table">',
    "  <tr><td>Receipt No.</td><td>" + escapeHtml(transactionId) + "</td></tr>",
    "  <tr><td>Donor Name</td><td>" + escapeHtml(donorName) + "</td></tr>",
    "  <tr><td>Amount</td><td>KES " + amount.toLocaleString("en-KE") + "</td></tr>",
    "  <tr><td>Payment Method</td><td>" + escapeHtml(paymentMethod) + "</td></tr>",
    (mpesaReceiptNumber
      ? "  <tr><td>M-Pesa Receipt</td><td>" + escapeHtml(mpesaReceiptNumber) + "</td></tr>"
      : ""),
    "  <tr><td>Date</td><td>" + new Date().toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" }) + "</td></tr>",
    "  <tr><td>Organization</td><td>Reproductive Health Action and Rights Kenya (RHARK)</td></tr>",
    "</table>",
    "<hr />",
    "<p>This receipt serves as official documentation of your donation. Please retain it for your records.</p>",
    "<p>Thank you for supporting our mission!</p>",
    "<p><strong>The RHARK Team</strong></p>",
  ].join("\n");
}

/**
 * Failed donation notification email.
 */
export function buildDonationFailedHtml(
  donorName: string,
  amount: number,
  reason: string
): string {
  return [
    "<p>Dear <strong>" + escapeHtml(donorName) + "</strong>,</p>",
    "<p>Unfortunately, your donation to RHARK could not be processed.</p>",
    '<p><span class="badge-error">Payment Failed</span></p>',
    "<hr />",
    '<table class="receipt-table">',
    "  <tr><td>Amount</td><td>KES " + amount.toLocaleString("en-KE") + "</td></tr>",
    "  <tr><td>Reason</td><td>" + escapeHtml(reason) + "</td></tr>",
    "</table>",
    "<hr />",
    "<p>Please try again or contact us at info@rhark.org for assistance.</p>",
    "<p>Best regards,</p>",
    "<p><strong>The RHARK Team</strong></p>",
  ].join("\n");
}

// ─── Contact Email Templates ───────────────────────────────────────────────────

/**
 * Contact confirmation email sent to the user after submitting a contact form.
 */
export function buildContactConfirmationHtml(name: string): string {
  return [
    "<p>Dear <strong>" + escapeHtml(name) + "</strong>,</p>",
    "<p>Thank you for contacting RHARK. We have received your message and will get back to you within 2 business days.</p>",
    "<p>If your inquiry is urgent, please call us at +254 700 000 000 or email us directly at info@rhark.org.</p>",
    "<p>Best regards,</p>",
    "<p><strong>The RHARK Team</strong></p>",
  ].join("\n");
}

/**
 * Information request confirmation email.
 */
export function buildInfoRequestConfirmationHtml(name: string, programOfInterest?: string): string {
  const programLine = programOfInterest
    ? "<p>You requested information about: <strong>" + escapeHtml(programOfInterest) + "</strong></p>"
    : "";

  return [
    "<p>Dear <strong>" + escapeHtml(name) + "</strong>,</p>",
    "<p>Thank you for your interest in RHARK's programmes and services.</p>",
    programLine,
    "<p>We have received your information request and will send you the relevant details shortly.</p>",
    "<p>In the meantime, you can explore our work on our website or follow us on social media for updates.</p>",
    "<p>Best regards,</p>",
    "<p><strong>The RHARK Team</strong></p>",
  ].join("\n");
}

// ─── Admin Reply Template ──────────────────────────────────────────────────────

/**
 * Build an admin reply email sent to a user.
 */
export function buildAdminReplyHtml(
  originalSubject: string,
  replyMessage: string,
  adminName: string
): string {
  return [
    "<p>Dear valued contact,</p>",
    "<p>Thank you for reaching out to RHARK. Please find our response below:</p>",
    "<hr />",
    "<p>" + escapeHtml(replyMessage).replace(/\n/g, "<br />") + "</p>",
    "<hr />",
    "<p>Best regards,</p>",
    "<p><strong>" + escapeHtml(adminName) + "</strong></p>",
    "<p>RHARK Team</p>",
    '<p style="font-size:12px; color:#9ca3af;">Reference: ' + escapeHtml(originalSubject) + "</p>",
  ].join("\n");
}

// ─── Welcome Email Template ────────────────────────────────────────────────────

export function buildWelcomeEmailHtml(name: string): string {
  return [
    "<p>Dear <strong>" + escapeHtml(name) + "</strong>,</p>",
    "<p>Welcome to RHARK! We are thrilled to have you join our community.</p>",
    "<p>At RHARK, we are committed to advancing Sexual and Reproductive Health and Rights, gender equality, and youth empowerment in Siaya County, Kenya.</p>",
    "<p>Here are some ways you can get involved:</p>",
    '<ul style="color:#374151; font-size:15px; line-height:1.8;">',
    "  <li>Volunteer with us</li>",
    "  <li>Partner with us</li>",
    "  <li>Donate to support our programmes</li>",
    "  <li>Follow us on social media</li>",
    "</ul>",
    "<p>Visit our website to learn more about our work and impact.</p>",
    "<p>Best regards,</p>",
    "<p><strong>The RHARK Team</strong></p>",
  ].join("\n");
}

// ─── Template Router ───────────────────────────────────────────────────────────

export interface TemplateResult {
  subject: string;
  html: string;
}

/**
 * Route to the correct email template based on type.
 */
export function buildTemplate(
  templateType: EmailTemplateType,
  data: Record<string, unknown>
): TemplateResult {
  switch (templateType) {
    case "welcome":
      return {
        subject: "Welcome to RHARK!",
        html: buildWelcomeEmailHtml(data.name as string),
      };
    case "contact-confirmation":
      return {
        subject: "Thank you for contacting RHARK",
        html: buildContactConfirmationHtml(data.name as string),
      };
    case "info-request-confirmation":
      return {
        subject: "RHARK Information Request Received",
        html: buildInfoRequestConfirmationHtml(data.name as string, data.programOfInterest as string | undefined),
      };
    case "donation-thank-you":
      return {
        subject: "Thank You for Your Donation to RHARK!",
        html: buildDonationThankYouHtml(
          data.donorName as string,
          data.amount as number,
          data.transactionId as string,
          data.paymentMethod as string
        ),
      };
    case "donation-receipt":
      return {
        subject: "RHARK Donation Receipt",
        html: buildDonationReceiptHtml(
          data.donorName as string,
          data.amount as number,
          data.transactionId as string,
          data.paymentMethod as string,
          data.mpesaReceiptNumber as string | undefined
        ),
      };
    case "donation-failed":
      return {
        subject: "RHARK Donation Payment Failed",
        html: buildDonationFailedHtml(
          data.donorName as string,
          data.amount as number,
          (data.reason as string) || "Transaction could not be completed"
        ),
      };
    case "admin-notification":
      return {
        subject: "[RHARK Admin] New " + (data.formType as string) + " Submission",
        html: buildAdminNotificationHtml(data.formType as string, data.fields as Record<string, string>),
      };
    case "contact-reply":
      return {
        subject: "Re: " + ((data.originalSubject as string) || "Your RHARK Inquiry"),
        html: buildAdminReplyHtml(
          data.originalSubject as string,
          data.replyMessage as string,
          data.adminName as string
        ),
      };
    case "password-reset":
      return {
        subject: "RHARK Password Reset Request",
        html: buildAutoReplyHtml(data.name as string, "password reset", "Click the link below to reset your password."),
      };
    case "account-verification":
      return {
        subject: "Verify Your RHARK Account",
        html: buildAutoReplyHtml(data.name as string, "account verification", "Please verify your email address to activate your account."),
      };
    default:
      return {
        subject: "Message from RHARK",
        html: buildAutoReplyHtml(data.name as string, "general", "Thank you for your message."),
      };
  }
}

function escapeHtml(text: string): string {
  const amp = String.fromCharCode(38) + "amp;";
  const lt = String.fromCharCode(38) + "lt;";
  const gt = String.fromCharCode(38) + "gt;";
  const quot = String.fromCharCode(38) + "quot;";
  const apos = String.fromCharCode(38) + "#039;";
  const ENTITY_MAP: Record<string, string> = {
    [String.fromCharCode(38)]: amp,
    [String.fromCharCode(60)]: lt,
    [String.fromCharCode(62)]: gt,
    [String.fromCharCode(34)]: quot,
    [String.fromCharCode(39)]: apos,
  };
  return text.replace(/[&<>"']/g, (ch) => ENTITY_MAP[ch]);
}
