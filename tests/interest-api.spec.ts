import { test, expect } from "@playwright/test";
import { POST } from "../src/app/api/interests/route";

const lead = {
  name: "Ana Teste",
  email: "ANA@example.com",
  establishmentType: "Barbearia",
  whatsapp: "(11) 99999-9999",
};
const request = (data: unknown) =>
  new Request("http://localhost:3000/api/interests", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "http://localhost:3000",
    },
    body: JSON.stringify(data),
  });
let originalFetch: typeof fetch;
let env: { key?: string; from?: string; site?: string };
test.beforeEach(() => {
  originalFetch = globalThis.fetch;
  env = {
    key: process.env.RESEND_API_KEY,
    from: process.env.INTEREST_EMAIL_FROM,
    site: process.env.SITE_URL,
  };
  process.env.RESEND_API_KEY = "test-key";
  process.env.INTEREST_EMAIL_FROM = "Zelora <contato@example.com>";
  process.env.SITE_URL = "http://localhost:3000";
});
test.afterEach(() => {
  globalThis.fetch = originalFetch;
  for (const [key, value] of Object.entries({
    RESEND_API_KEY: env.key,
    INTEREST_EMAIL_FROM: env.from,
    SITE_URL: env.site,
  })) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

test("sends all fields to fixed recipient with reply-to and stable retry key", async () => {
  const calls: RequestInit[] = [];
  globalThis.fetch = async (url, init) => {
    expect(url).toBe("https://api.resend.com/emails");
    calls.push(init!);
    return Response.json({ id: "mock-email-id" });
  };
  expect(
    (await POST(request({ ...lead, to: "attacker@example.com" }))).status,
  ).toBe(201);
  expect((await POST(request(lead))).status).toBe(201);
  const body = JSON.parse(String(calls[0].body));
  expect(body.to).toEqual(["gpego786@gmail.com"]);
  expect(body.from).toBe("Zelora <contato@example.com>");
  expect(body.reply_to).toBe("ana@example.com");
  for (const value of [
    "Ana Teste",
    "ana@example.com",
    "Barbearia",
    "+5511999999999",
  ])
    expect(body.text).toContain(value);
  expect(new Headers(calls[0].headers).get("Idempotency-Key")).toBe(
    new Headers(calls[1].headers).get("Idempotency-Key"),
  );
});

test("rejects invalid data, foreign origins and oversized bodies before contacting provider", async () => {
  let calls = 0;
  globalThis.fetch = async () => {
    calls++;
    throw new Error("should not call");
  };
  const response = await POST(
    request({ ...lead, email: "bad\r\nBcc:other@example.com", name: "A" }),
  );
  expect(response.status).toBe(422);
  expect((await response.json()).errors).toHaveProperty("email");
  expect(
    (
      await POST(
        new Request("http://localhost:3000/api/interests", {
          method: "POST",
          headers: { origin: "https://foreign.example" },
        }),
      )
    ).status,
  ).toBe(403);
  expect(
    (await POST(request({ ...lead, name: "x".repeat(9000) }))).status,
  ).toBe(413);
  expect(calls).toBe(0);
});

test("does not report success without configuration or provider confirmation", async () => {
  delete process.env.RESEND_API_KEY;
  expect((await POST(request(lead))).status).toBe(503);
  process.env.RESEND_API_KEY = "test-key";
  globalThis.fetch = async () =>
    Response.json({ error: "provider detail" }, { status: 401 });
  const rejected = await POST(request(lead));
  expect(rejected.status).toBe(502);
  expect(JSON.stringify(await rejected.json())).not.toContain(
    "provider detail",
  );
  globalThis.fetch = async () => Response.json({});
  expect((await POST(request(lead))).status).toBe(502);
  globalThis.fetch = async () => {
    throw new Error("timeout");
  };
  expect((await POST(request(lead))).status).toBe(502);
});

test("optional WhatsApp and malformed requests", async () => {
  globalThis.fetch = async (_url, init) => {
    expect(JSON.parse(String(init?.body)).text).toContain(
      "WhatsApp: Não informado",
    );
    return Response.json({ id: "mock-id" });
  };
  expect((await POST(request({ ...lead, whatsapp: "" }))).status).toBe(201);
  expect(
    (
      await POST(
        new Request("http://localhost:3000/api/interests", {
          method: "POST",
          body: "{}",
        }),
      )
    ).status,
  ).toBe(415);
  expect(
    (
      await POST(
        new Request("http://localhost:3000/api/interests", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: "{",
        }),
      )
    ).status,
  ).toBe(400);
});
