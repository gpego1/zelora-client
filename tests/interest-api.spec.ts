import { test, expect } from "@playwright/test";
import { createInterestHandler } from "../src/lib/interest-handler";
import {
  createEmailSender,
  interestMessage,
  smtpConfigured,
  smtpOptions,
} from "../src/lib/interest-mail";
import type { Interest } from "../src/lib/interest";

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
const keys = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
  "INTEREST_EMAIL_FROM",
  "SITE_URL",
] as const;
let env: Record<string, string | undefined>;
test.beforeEach(() => {
  env = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
  Object.assign(process.env, {
    SMTP_HOST: "smtp.gmail.com",
    SMTP_PORT: "465",
    SMTP_USER: "sender@example.com",
    SMTP_PASS: "test-only-password",
    INTEREST_EMAIL_FROM: "",
    SITE_URL: "http://localhost:3000",
  });
});
test.afterEach(() => {
  for (const key of keys)
    if (env[key] === undefined) delete process.env[key];
    else process.env[key] = env[key];
});

test("sends all fields to fixed recipient and deduplicates concurrent/repeated requests", async () => {
  const calls: Interest[] = [];
  const post = createInterestHandler(async (data) => {
    calls.push(data);
  }, smtpConfigured);
  const responses = await Promise.all([
    post(request({ ...lead, to: "attacker@example.com" })),
    post(request(lead)),
  ]);
  expect(responses.map((response) => response.status)).toEqual([201, 201]);
  expect(calls).toHaveLength(1);
  expect((await post(request(lead))).status).toBe(201);
  expect(calls).toHaveLength(1);
  const message = interestMessage(calls[0]);
  expect(message.to).toBe("gpego786@gmail.com");
  expect(message.from).toBe("sender@example.com");
  expect(message.replyTo).toBe("ana@example.com");
  for (const value of [
    "Ana Teste",
    "ana@example.com",
    "Barbearia",
    "+5511999999999",
  ])
    expect(message.text).toContain(value);
});

test("rejects invalid data, foreign origins and oversized bodies without sending", async () => {
  let calls = 0;
  const post = createInterestHandler(async () => {
    calls++;
  }, smtpConfigured);
  const response = await post(
    request({ ...lead, email: "bad\r\nBcc:other@example.com", name: "A" }),
  );
  expect(response.status).toBe(422);
  expect((await response.json()).errors).toHaveProperty("email");
  expect(
    (
      await post(
        new Request("http://localhost:3000/api/interests", {
          method: "POST",
          headers: { origin: "https://foreign.example" },
        }),
      )
    ).status,
  ).toBe(403);
  expect(
    (await post(request({ ...lead, name: "x".repeat(9000) }))).status,
  ).toBe(413);
  expect(calls).toBe(0);
});

test("missing configuration and failed sends never report success; retry remains possible", async () => {
  let attempts = 0;
  const post = createInterestHandler(async () => {
    attempts++;
    if (attempts === 1) throw new Error("private provider error");
  }, smtpConfigured);
  delete process.env.SMTP_PASS;
  expect((await post(request(lead))).status).toBe(503);
  expect(attempts).toBe(0);
  process.env.SMTP_PASS = "test-only";
  const failed = await post(request(lead));
  expect(failed.status).toBe(502);
  expect(JSON.stringify(await failed.json())).not.toContain(
    "private provider error",
  );
  expect((await post(request(lead))).status).toBe(201);
  expect(attempts).toBe(2);
});

test("optional WhatsApp and malformed requests", async () => {
  const post = createInterestHandler(async (data) => {
    expect(interestMessage(data).text).toContain("WhatsApp: Não informado");
  }, smtpConfigured);
  expect((await post(request({ ...lead, whatsapp: "" }))).status).toBe(201);
  expect(
    (
      await post(
        new Request("http://localhost:3000/api/interests", {
          method: "POST",
          body: "{}",
        }),
      )
    ).status,
  ).toBe(415);
  expect(
    (
      await post(
        new Request("http://localhost:3000/api/interests", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: "{",
        }),
      )
    ).status,
  ).toBe(400);
});

test("SMTP uses TLS, honors ports and only succeeds on recipient acceptance", async () => {
  expect(smtpOptions()).toMatchObject({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    requireTLS: true,
  });
  process.env.SMTP_PORT = "587";
  expect(smtpOptions()).toMatchObject({
    port: 587,
    secure: false,
    requireTLS: true,
  });
  process.env.SMTP_PORT = "25";
  expect(smtpConfigured()).toBe(false);
  process.env.SMTP_PORT = "465";
  let closed = 0;
  const data = { ...lead, email: "ana@example.com" };
  const send = createEmailSender(() => ({
    sendMail: async (message) => {
      expect(message.to).toBe("gpego786@gmail.com");
      return { accepted: ["gpego786@gmail.com"] };
    },
    close: () => {
      closed++;
    },
  }));
  await send(data);
  const rejected = createEmailSender(() => ({
    sendMail: async () => ({ accepted: [] }),
    close: () => {
      closed++;
    },
  }));
  await expect(rejected(data)).rejects.toThrow("SMTP recipient not accepted");
  const failed = createEmailSender(() => ({
    sendMail: async () => {
      throw new Error("SMTP failure");
    },
    close: () => {
      closed++;
    },
  }));
  await expect(failed(data)).rejects.toThrow("SMTP failure");
  expect(closed).toBe(3);
});
