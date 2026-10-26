import { createHash } from "node:crypto";
import { validateInterest } from "@/lib/interest";

export const runtime = "nodejs";
const recipient = "gpego786@gmail.com";
const unavailable =
  "Não foi possível enviar seu interesse agora. Tente novamente mais tarde.";
const json = (body: unknown, status: number) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const allowedOrigin = process.env.SITE_URL
    ? new URL(process.env.SITE_URL).origin
    : new URL(request.url).origin;
  if (origin && origin !== allowedOrigin)
    return json({ message: "Origem não permitida." }, 403);
  if (!request.headers.get("content-type")?.includes("application/json"))
    return json({ message: "Envie os dados em JSON." }, 415);

  // Limit the actual stream, rather than trusting a client-supplied Content-Length.
  const reader = request.body?.getReader();
  if (!reader) return json({ message: "Informe os dados do formulário." }, 400);
  let text = "";
  let bytes = 0;
  const decoder = new TextDecoder();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > 8192) {
        await reader.cancel();
        return json({ message: "Dados acima do limite permitido." }, 413);
      }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
  } catch {
    return json({ message: "Não foi possível ler os dados." }, 400);
  }

  let input: unknown;
  try {
    input = JSON.parse(text);
  } catch {
    return json({ message: "Dados inválidos." }, 400);
  }
  const { data, errors } = validateInterest(input);
  if (Object.keys(errors).length)
    return json({ errors, message: "Revise os campos indicados." }, 422);

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.INTEREST_EMAIL_FROM;
  if (!apiKey || !from) return json({ message: unavailable }, 503);

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        // Identical registrations/retries share a key; Resend deduplicates for 24h.
        "Idempotency-Key": `zelora-interest/${createHash("sha256")
          .update(JSON.stringify({ from, recipient, ...data }))
          .digest("hex")}`,
      },
      body: JSON.stringify({
        from,
        to: [recipient],
        reply_to: data.email,
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
      }),
      signal: AbortSignal.timeout(10_000),
      cache: "no-store",
    });
    if (!response.ok)
      return json(
        { message: unavailable },
        response.status === 429 ? 429 : 502,
      );
    const result = await response.json();
    if (typeof result?.id !== "string" || !result.id)
      return json({ message: unavailable }, 502);
    return json(
      { message: "Seu interesse foi enviado. Obrigado por conhecer o Zelora!" },
      201,
    );
  } catch {
    return json({ message: unavailable }, 502);
  }
}
