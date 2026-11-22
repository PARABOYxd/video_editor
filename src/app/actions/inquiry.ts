"use server";

import { after } from "next/server";
import { getDb } from "@/lib/db";
import { readInquiry, validateInquiry, type InquiryErrors, type InquiryValues } from "@/lib/inquiry";
import { notifyNewInquiry } from "@/lib/notify";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export type InquiryState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: InquiryErrors;
  values?: InquiryValues;
};

export async function submitInquiry(_prev: InquiryState, formData: FormData): Promise<InquiryState> {
  const values = readInquiry(formData);

  // Honeypot: real people never see or fill this field.
  if (String(formData.get("contact_extra") ?? "")) {
    return { status: "success", message: "Thanks, your message is on its way." };
  }

  const errors = validateInquiry(values);
  if (Object.keys(errors).length) return { status: "error", message: "Please check the highlighted fields.", errors, values };

  if (!rateLimit(`inquiry:${await clientIp()}`, 5, 10 * 60 * 1000)) {
    return { status: "error", message: "Too many messages from this connection. Please try again in a few minutes.", values };
  }

  try {
    const db = await getDb();
    if (!db) return { status: "error", message: "The form isn't connected yet. Please reach us on WhatsApp or email instead.", values };
    const { name, email, projectType, budget, deadline, message, reference } = values;
    await db.query(
      "insert into inquiries (name, email, project_type, budget, deadline, message, reference_url) values ($1, $2, $3, $4, $5, $6, $7)",
      [name, email, projectType, budget, deadline, message, reference]
    );
  } catch (err) {
    console.error("Saving the inquiry failed", err);
    return { status: "error", message: "Your brief couldn't be sent. Please try again, or reach us on WhatsApp or email.", values };
  }

  after(() => notifyNewInquiry(values).catch((err) => console.error("Inquiry notification failed", err)));

  return { status: "success", message: `Thanks ${values.name.split(" ")[0]}, we've got your brief and will get back to you soon.` };
}
