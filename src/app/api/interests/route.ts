import { createInterestHandler } from "@/lib/interest-handler";
import { sendInterestEmail, smtpConfigured } from "@/lib/interest-mail";

export const runtime = "nodejs";
export const POST = createInterestHandler(sendInterestEmail, smtpConfigured);
