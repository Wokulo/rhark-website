import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { store } from "@/lib/store";
import { sendEmail, buildEmailHtml, buildTemplate, buildAutoReplyHtml } from "@/lib/email";

const internshipSchema = z.object({
  firstName: z.string().min(2, "First name is required").max(100),
  lastName: z.string().min(2, "Last name is required").max(100),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  phone: z.string().regex(/^(\+254|0)[17]\d{8}$/, "Please enter a valid Kenyan phone number"),
  area: z.string().min(1, "Please select an internship area"),
  duration: z.string().min(1, "Please select duration"),
  startDate: z.string().min(1, "Please provide your start date"),
  motivation: z.string().min(30, "Please tell us why you want to intern with RHARK (min 30 characters)").max(1000),
  cvUrl: z.string().url("Please provide a valid URL to your CV").optional().or(z.literal("")),
  _honeypot: z.string().max(0, "Invalid submission"),
});

export type InternshipSchema = z.infer<typeof internshipSchema>;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = internshipSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    if (parsed.data._honeypot) {
      return NextResponse.json({ success: true });
    }

    const { firstName, lastName, email, phone, area, duration, startDate, motivation, cvUrl } = parsed.data;

    const contact = store.createContact({
      name: `${firstName} ${lastName}`,
      email,
      phone,
      subject: `Internship Application - ${area}`,
      message: `Internship Area: ${area}\nDuration: ${duration}\nStart Date: ${startDate}\nMotivation: ${motivation}\nCV: ${cvUrl || "Not provided"}`,
      inquiryType: "program",
      status: "new",
    });

    try {
      await sendEmail({
        to: process.env.CONTACT_EMAIL || "info@rhark.org",
        subject: "[RHARK Admin] New Internship Application",
        html: buildEmailHtml(
          buildTemplate("admin-notification", {
            formType: "Internship Application",
            fields: {
              "Applicant Name": `${firstName} ${lastName}`,
              Email: email,
              Phone: phone,
              "Internship Area": area,
              Duration: duration,
              "Start Date": startDate,
              Motivation: motivation,
              "CV URL": cvUrl || "Not provided",
            },
          }).html
        ),
      });
    } catch (emailErr) {
      console.error("[Internship] Failed to send admin notification:", emailErr);
    }

    try {
      await sendEmail({
        to: email,
        subject: "RHARK Internship Application Received",
        html: buildEmailHtml(
          buildAutoReplyHtml(firstName, "internship application", "We have received your internship application and will review it shortly. We will get back to you within 5 business days.")
        ),
      });
    } catch (emailErr) {
      console.error("[Internship] Failed to send auto-reply:", emailErr);
    }

    store.createNotification({
      type: "new-contact",
      title: "New Internship Application",
      message: `${firstName} ${lastName} applied for an internship in ${area}`,
      referenceId: contact.id,
      referenceType: "contact",
      isRead: false,
    });

    return NextResponse.json({
      success: true,
      message: "Internship application received. We will get back to you within 5 business days.",
    });
  } catch (error) {
    console.error("[Internship API] Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
