import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subject, content, subscriberIds } = body;

    if (!subject || !content || !subscriberIds || subscriberIds.length === 0) {
      return NextResponse.json(
        { success: false, message: "Subject, content, and subscriber IDs are required." },
        { status: 400 }
      );
    }

    const sentCount = subscriberIds.filter((id: string) => {
      const subscriber = store.getSubscriber(id);
      if (!subscriber) return false;

      store.createEmail({
        templateType: "admin-notification",
        to: subscriber.email,
        from: "rharkenya@gmail.com",
        subject,
        body: content,
        status: "queued",
      });

      return true;
    }).length;

    return NextResponse.json({
      success: true,
      message: `Newsletter queued for ${sentCount} subscriber(s).`,
      data: { sentCount, queuedCount: sentCount },
    });
  } catch (error) {
    console.error("[Admin Newsletter Send] Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
