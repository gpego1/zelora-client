import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import type { Interest } from "./interest";

export const interestRecipient = "gpego786@gmail.com";

export function smtpOptions(): SMTPTransport.Options | null {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS;
  const port = Number(process.env.SMTP_PORT || "465");
  if (!host || !user || !pass || ![465, 587].includes(port)) return null;
  return {
    host,
    port,
    secure: port === 465,
    requireTLS: true,
    auth: { user, pass },
    connectionTimeout: 8_000,
    greetingTimeout: 8_000,
    socketTimeout: 10_000,
    disableFileAccess: true,
    disableUrlAccess: true,
  };
}

export function smtpConfigured() {
  return smtpOptions() !== null;
}

export function interestMessage(data: Interest) {
  return {
    from:
      process.env.INTEREST_EMAIL_FROM?.trim() || process.env.SMTP_USER?.trim(),
    to: interestRecipient,
    replyTo: data.email,
    subject: "Novo interesse no Zelora",
    text: [
      "Novo cadastro de interesse no Zelora",
      "",
      `Nome: ${data.name}`,
      `E-mail: ${data.email}`,
      `Tipo de estabelecimento: ${data.establishmentType}`,
      `WhatsApp: ${data.whatsapp || "Não informado"}`,
      "",
      "Contato solicitado para conhecer o Zelora. Não há consentimento de marketing adicional.",
    ].join("\n"),
  };
}

type MailTransport = {
  sendMail: (
    message: ReturnType<typeof interestMessage>,
  ) => Promise<{ accepted: unknown[] }>;
  close: () => void;
};

export function createEmailSender(
  factory: (options: SMTPTransport.Options) => MailTransport = (options) =>
    nodemailer.createTransport(options),
) {
  return async function sendInterestEmail(data: Interest) {
    const options = smtpOptions();
    if (!options) throw new Error("SMTP unavailable");
    const transport = factory(options);
    try {
      const result = await transport.sendMail(interestMessage(data));
      if (
        !result.accepted.some(
          (address) => String(address).toLowerCase() === interestRecipient,
        )
      ) {
        throw new Error("SMTP recipient not accepted");
      }
    } finally {
      transport.close();
    }
  };
}

export const sendInterestEmail = createEmailSender();
