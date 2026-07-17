import { NextRequest, NextResponse } from "next/server";
import { volunteerSchema } from "@/lib/validations";
import { store } from "@/lib/store";
import { sendEmail, buildEmailHtml, buildTemplate, buildAutoReplyHtml } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = volunteerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    if (parsed.data._honeypot) {
      return NextResponse.json({ success: true });
    }

    const { firstName, lastName, email, phone, county, skills, availability, motivation } = parsed.data;

    const contact = store.createContact({
      name: `${firstName} ${lastName}`,
      email,
      phone,
      subject: `Volunteer Application - ${county}`,
      message: `Skills: ${skills}\nAvailability: ${availability}\nMotivation: ${motivation}`,
      inquiryType: "general",
      status: "new",
    });

    try {
      await sendEmail({
        to: process.env.CONTACT_EMAIL || "rharkenya@gmail.com",
        subject: "[RHARK Admin] New Volunteer Application",
        html: buildEmailHtml(
          buildTemplate("admin-notification", {
            formType: "Volunteer Application",
            fields: {
              "Applicant Name": `${firstName} ${lastName}`,
              Email: email,
              Phone: phone,
              County: county,
              Skills: skills,
              Availability: availability,
              Motivation: motivation,
            },
          }).html
        ),
      });
    } catch (emailErr) {
      console.error("[Volunteer] Failed to send admin notification:", emailErr);
    }

    try {
      await sendEmail({
        to: email,
        subject: "RHARK Volunteer Application Received",
        html: buildEmailHtml(
          buildAutoReplyHtml(firstName, "volunteer application", "We have received your volunteer application and will review it shortly. We will get back to you within 5 business days.")
        ),
      });
    } catch (emailErr) {
      console.error("[Volunteer] Failed to send auto-reply:", emailErr);
    }

    store.createNotification({
      type: "new-contact",
      title: "New Volunteer Application",
      message: `${firstName} ${lastName} submitted a volunteer application from ${county}`,
      referenceId: contact.id,
      referenceType: "contact",
      isRead: false,
    });

    return NextResponse.json({
      success: true,
      message: "Application received. We will get back to you within 5 business days.",
    });
  } catch (error) {
    console.error("[Volunteer API] Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
