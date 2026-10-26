import { createHash } from "node:crypto";
import { validateInterest, type Interest } from "@/lib/interest";

const unavailable =
  "Não foi possível enviar seu interesse agora. Tente novamente mais tarde.";
const json = (body: unknown, status: number) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export function createInterestHandler(
  send: (data: Interest) => Promise<void>,
  configured: () => boolean,
) {
  const deliveries = new Map<
    string,
    { expires: number; promise: Promise<void> }
  >();
  return async function POST(request: Request) {
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
    if (!reader)
      return json({ message: "Informe os dados do formulário." }, 400);
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

    if (!configured()) return json({ message: unavailable }, 503);
    const key = createHash("sha256").update(JSON.stringify(data)).digest("hex");
    const now = Date.now();
    for (const [id, entry] of deliveries)
      if (entry.expires <= now) deliveries.delete(id);
    try {
      let delivery = deliveries.get(key);
      if (!delivery) {
        if (deliveries.size >= 1000) return json({ message: unavailable }, 429);
        delivery = {
          expires: now + 10 * 60_000,
          promise: Promise.resolve().then(() => send(data)),
        };
        deliveries.set(key, delivery);
      }
      await delivery.promise;
      return json(
        {
          message: "Seu interesse foi enviado. Obrigado por conhecer o Zelora!",
        },
        201,
      );
    } catch {
      deliveries.delete(key);
      return json({ message: unavailable }, 502);
    }
  };
}
