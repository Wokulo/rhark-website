import { NextRequest, NextResponse } from "next/server";
import { newsletterSchema } from "@/lib/validations";
import { store } from "@/lib/store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = newsletterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const existing = store.getSubscriberByEmail(parsed.data.email);
    if (existing) {
      return NextResponse.json(
        { success: true, message: "You are already subscribed to RHARK updates." },
        { status: 200 }
      );
    }

    store.createSubscriber({
      email: parsed.data.email,
      firstName: parsed.data.firstName,
      source: "website",
    });

    if (process.env.NODE_ENV === "development") {
      console.log("Newsletter signup:", parsed.data.email);
    }

    return NextResponse.json(
      { success: true, message: "Successfully subscribed to RHARK updates." },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
