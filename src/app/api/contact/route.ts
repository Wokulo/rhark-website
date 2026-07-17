import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations";
import { store } from "@/lib/store";
import { sendEmail, buildEmailHtml, buildTemplate } from "@/lib/email";

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

    const { name, email, phone, organization, subject, message, programOfInterest, inquiryType } = parsed.data;

    // 1. Store the contact request
    const contact = store.createContact({
      name,
      email,
      phone: phone || undefined,
      organization: organization || undefined,
      subject,
      message,
      programOfInterest: programOfInterest || undefined,
      inquiryType: inquiryType || "general",
      status: "new",
    });

    // 2. Send confirmation email to the user
    const templateType = inquiryType === "information" ? "info-request-confirmation" : "contact-confirmation";
    const userTemplate = buildTemplate(templateType, {
      name,
      programOfInterest: programOfInterest || undefined,
    });

    try {
      await sendEmail({
        to: email,
        subject: userTemplate.subject,
        html: buildEmailHtml(userTemplate.html),
        replyTo: process.env.CONTACT_EMAIL || "rharkenya@gmail.com",
      });
      store.createEmail({
        templateType,
        to: email,
        from: process.env.SMTP_FROM || "noreply@rhark.org",
        subject: userTemplate.subject,
        body: userTemplate.html,
        status: "sent",
        sentAt: new Date().toISOString(),
        referenceId: contact.id,
        referenceType: "contact",
      });
    } catch (emailErr) {
      console.error("[Contact] Failed to send confirmation email:", emailErr);
      store.createEmail({
        templateType,
        to: email,
        from: process.env.SMTP_FROM || "noreply@rhark.org",
        subject: userTemplate.subject,
        body: userTemplate.html,
        status: "failed",
        errorMessage: emailErr instanceof Error ? emailErr.message : "Unknown error",
        referenceId: contact.id,
        referenceType: "contact",
      });
    }

    // 3. Send notification to RHARK admin
    const adminEmail = process.env.CONTACT_EMAIL || "rharkenya@gmail.com";
    const adminTemplate = buildTemplate("admin-notification", {
      formType: "Contact Form",
      fields: {
        name,
        email,
        phone: phone || "",
        organization: organization || "",
        subject,
        message,
        programOfInterest: programOfInterest || "",
        inquiryType: inquiryType || "general",
      },
    });

    try {
      await sendEmail({
        to: adminEmail,
        subject: adminTemplate.subject,
        html: buildEmailHtml(adminTemplate.html),
      });
    } catch (emailErr) {
      console.error("[Contact] Failed to send admin notification:", emailErr);
    }

    // 4. Create a communication thread
    store.createThread({
      contactRequestId: contact.id,
      messages: [
        { from: "user", content: message, createdAt: new Date().toISOString() },
      ],
    });

    // 5. Create notification for admin dashboard
    store.createNotification({
      type: "new-contact",
      title: "New Contact Form Submission",
      message: `${name} sent a new message: ${subject}`,
      referenceId: contact.id,
      referenceType: "contact",
      isRead: false,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Message received. We will get back to you within 2 business days.",
        data: { id: contact.id },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Contact API] Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}