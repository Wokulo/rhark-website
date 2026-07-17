import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { adminReplySchema } from "@/lib/validations";
import { sendEmail, buildEmailHtml, buildTemplate } from "@/lib/email";

/**
 * GET /api/admin/contacts — List contacts with optional filtering
 * POST /api/admin/contacts — Reply to a contact
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || undefined;
    const inquiryType = searchParams.get("inquiryType") || undefined;
    const search = searchParams.get("search") || undefined;
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");

    const result = store.listContacts({
      status: status as any,
      inquiryType: inquiryType as any,
      search,
      page,
      pageSize,
    });

    // Attach communication threads
    const contactsWithThreads = result.data?.map((contact) => {
      const thread = store.getThreadByContactId(contact.id);
      return { ...contact, thread: thread || null };
    });

    return NextResponse.json({
      ...result,
      data: contactsWithThreads,
    });
  } catch (error) {
    console.error("[Admin Contacts] Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/contacts — Reply to a contact
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = adminReplySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { contactId, message } = parsed.data;

    const contact = store.getContact(contactId);
    if (!contact) {
      return NextResponse.json(
        { success: false, message: "Contact not found." },
        { status: 404 }
      );
    }

    // Add message to thread
    const thread = store.addMessageToThread(contactId, {
      from: "admin",
      content: message,
    });

    // Update contact status
    store.updateContact(contactId, { status: "replied" });

    // Send reply email
    const template = buildTemplate("contact-reply", {
      originalSubject: contact.subject,
      replyMessage: message,
      adminName: "RHARK Team",
    });

    try {
      await sendEmail({
        to: contact.email,
        subject: template.subject,
        html: buildEmailHtml(template.html),
        replyTo: process.env.CONTACT_EMAIL || "rharkenya@gmail.com",
      });

      const emailRecord = store.createEmail({
        templateType: "contact-reply",
        to: contact.email,
        from: process.env.SMTP_FROM || "noreply@rhark.org",
        subject: template.subject,
        body: template.html,
        status: "sent",
        sentAt: new Date().toISOString(),
        referenceId: contactId,
        referenceType: "contact",
      });

      // Update contact email history
      if (contact.emailHistory) {
        contact.emailHistory.push({
          emailId: emailRecord.id,
          type: "contact-reply",
          sentAt: new Date().toISOString(),
        });
      }
    } catch (emailErr) {
      console.error("[Admin Contacts] Failed to send reply email:", emailErr);
    }

    return NextResponse.json({
      success: true,
      message: "Reply sent successfully.",
      data: { thread, contact: store.getContact(contactId) },
    });
  } catch (error) {
    console.error("[Admin Contacts] Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}