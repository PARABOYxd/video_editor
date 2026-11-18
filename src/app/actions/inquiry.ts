"use server";

import { getDb } from "@/lib/db";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { fieldErrors, inquirySchema, type FieldErrors } from "@/lib/validation";

export type InquiryState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: FieldErrors;
  values?: Record<string, string>;
};

export async function submitInquiry(_prev: InquiryState, formData: FormData): Promise<InquiryState> {
  const values = Object.fromEntries(
    ["name", "email", "projectType", "budget", "deadline", "message"].map((k) => [k, String(formData.get(k) ?? "")])
  );

  // Honeypot: real people never see or fill this field.
  if (String(formData.get("company") ?? "")) {
    return { status: "success", message: "Thanks, your message is on its way." };
  }

  if (!rateLimit(`inquiry:${await clientIp()}`, 5, 10 * 60 * 1000)) {
    return { status: "error", message: "Too many messages from this connection. Please try again in a few minutes.", values };
  }

  const parsed = inquirySchema.safeParse(values);
  if (!parsed.success) {
    return { status: "error", message: "Please check the highlighted fields.", errors: fieldErrors(parsed.error), values };
  }

  const db = await getDb();
  if (!db) {
    return {
      status: "error",
      message: "The form isn't connected yet. Please reach us on WhatsApp or email below.",
      values,
    };
  }

  const { name, email, projectType, budget, deadline, message } = parsed.data;
  await db.query(
    "insert into inquiries (name, email, project_type, budget, deadline, message) values ($1, $2, $3, $4, $5, $6)",
    [name, email, projectType, budget, deadline, message]
  );

  return { status: "success", message: `Thanks ${name.split(" ")[0]}, we've got your brief and will get back to you soon.` };
}
