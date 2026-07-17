import { NextRequest, NextResponse } from "next/server";
import { partnershipInquirySchema } from "@/lib/validations";
import { store } from "@/lib/store";
import { sendEmail, buildEmailHtml, buildTemplate, buildAutoReplyHtml } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = partnershipInquirySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    if (parsed.data._honeypot) {
      return NextResponse.json({ success: true });
    }

    const { organizationName, contactName, email, phone, partnershipType, message } = parsed.data;

    const contact = store.createContact({
      name: contactName,
      email,
      phone: phone || undefined,
      organization: organizationName,
      subject: `Partnership Inquiry - ${partnershipType}`,
      message,
      inquiryType: "partnership",
      status: "new",
    });

    try {
      await sendEmail({
        to: process.env.CONTACT_EMAIL || "rharkenya@gmail.com",
        subject: "[RHARK Admin] New Partnership Inquiry",
        html: buildEmailHtml(
          buildTemplate("admin-notification", {
            formType: "Partnership Inquiry",
            fields: {
              "Organization Name": organizationName,
              "Contact Name": contactName,
              Email: email,
              Phone: phone || "",
              "Partnership Type": partnershipType,
              Message: message,
            },
          }).html
        ),
      });
    } catch (emailErr) {
      console.error("[Partner] Failed to send admin notification:", emailErr);
    }

    try {
      await sendEmail({
        to: email,
        subject: "RHARK Partnership Inquiry Received",
        html: buildEmailHtml(
          buildAutoReplyHtml(contactName, "partnership inquiry", "We have received your partnership inquiry and will review it shortly. Our team will get back to you within 3 business days.")
        ),
      });
    } catch (emailErr) {
      console.error("[Partner] Failed to send auto-reply:", emailErr);
    }

    store.createNotification({
      type: "new-contact",
      title: "New Partnership Inquiry",
      message: `${organizationName} submitted a partnership inquiry`,
      referenceId: contact.id,
      referenceType: "contact",
      isRead: false,
    });

    return NextResponse.json({
      success: true,
      message: "Partnership inquiry received. We will get back to you within 3 business days.",
    });
  } catch (error) {
    console.error("[Partner API] Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
