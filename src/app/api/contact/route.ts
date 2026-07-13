import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Honeypot check — bots fill this field
    if (parsed.data._honeypot) {
      return NextResponse.json({ success: true }); // silently succeed
    }

    // TODO: Send email via SMTP (Nodemailer / Resend / SendGrid)
    // For now, log to console in development
    if (process.env.NODE_ENV === "development") {
      console.log("Contact form submission:", {
        name: parsed.data.name,
        email: parsed.data.email,
        subject: parsed.data.subject,
      });
    }

    return NextResponse.json(
      { success: true, message: "Message received. We will get back to you within 2 business days." },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
