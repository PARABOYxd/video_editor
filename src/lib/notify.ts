import "server-only";
import type { InquiryValues } from "./inquiry";

/**
 * TODO: email integration. Send yourselves each new inquiry here (Resend,
 * Postmark, SMTP...). It deliberately does nothing until you connect one:
 * inquiries are already saved and shown in /admin/inquiries.
 *
 * Called after the inquiry is saved; a failure here never fails the form.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function notifyNewInquiry(inquiry: InquiryValues): Promise<void> {}
