"use client";

import { useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import {
  establishmentTypes,
  validateInterest,
  type Field,
  type Errors,
} from "@/lib/interest";

export function InterestForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const pendingRef = useRef(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  async function validate(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pendingRef.current || status === "sent") return;
    const { data, errors: next } = validateInterest(
      Object.fromEntries(new FormData(event.currentTarget)),
    );
    setErrors(next);
    setMessage("");
    const first = Object.keys(next)[0];
    if (first) {
      formRef.current
        ?.querySelector<HTMLInputElement | HTMLSelectElement>(
          `[name="${first}"]`,
        )
        ?.focus();
      return;
    }
    pendingRef.current = true;
    setStatus("sending");
    try {
      const response = await fetch("/api/interests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(15_000),
      });
      const result = await response.json();
      if (!response.ok) {
        if (response.status === 422 && result.errors) {
          const serverErrors: Errors = {};
          for (const field of [
            "name",
            "email",
            "establishmentType",
            "whatsapp",
          ] as Field[]) {
            if (typeof result.errors[field] === "string")
              serverErrors[field] = result.errors[field];
          }
          setErrors(serverErrors);
        }
        throw new Error("send_failed");
      }
      setStatus("sent");
      setMessage("Seu interesse foi enviado. Obrigado por conhecer o Zelora!");
    } catch {
      setStatus("error");
      setMessage(
        "Não foi possível enviar seu interesse agora. Seus dados foram mantidos no formulário. Tente novamente mais tarde.",
      );
    } finally {
      pendingRef.current = false;
    }
  }

  const fieldProps = (field: Field) => ({
    "aria-invalid": !!errors[field],
    "aria-describedby": `${field}-hint${errors[field] ? ` ${field}-error` : ""}`,
  });
  const error = (field: Field) =>
    errors[field] ? (
      <span className="field-error" id={`${field}-error`}>
        {errors[field]}
      </span>
    ) : null;

  return (
    <form
      ref={formRef}
      className="interest-form"
      noValidate
      onSubmit={validate}
      onChange={() => {
        setStatus("idle");
        setMessage("");
      }}
      aria-describedby="contact-purpose"
      aria-busy={status === "sending"}
    >
      <fieldset className="form-grid" disabled={status === "sending"}>
        <legend className="sr-only">Seus dados para conhecer o Zelora</legend>
        <div className="field">
          <label htmlFor="name">
            Seu nome <span>*</span>
          </label>
          <input
            id="name"
            name="name"
            autoComplete="name"
            maxLength={100}
            required
            placeholder="Como podemos chamar você?"
            {...fieldProps("name")}
          />
          <span className="sr-only" id="name-hint">
            Obrigatório. Pelo menos 2 caracteres.
          </span>
          {error("name")}
        </div>
        <div className="field">
          <label htmlFor="email">
            E-mail <span>*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={254}
            required
            placeholder="voce@exemplo.com"
            {...fieldProps("email")}
          />
          <span className="sr-only" id="email-hint">
            Obrigatório. Informe um endereço de e-mail válido.
          </span>
          {error("email")}
        </div>
        <div className="field">
          <label htmlFor="establishmentType">
            Tipo de estabelecimento <span>*</span>
          </label>
          <select
            id="establishmentType"
            name="establishmentType"
            required
            defaultValue=""
            {...fieldProps("establishmentType")}
          >
            <option value="" disabled>
              Selecione seu tipo de negócio
            </option>
            {establishmentTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
          <span className="sr-only" id="establishmentType-hint">
            Obrigatório.
          </span>
          {error("establishmentType")}
        </div>
        <div className="field">
          <label htmlFor="whatsapp">
            WhatsApp <span className="optional">(opcional)</span>
          </label>
          <input
            id="whatsapp"
            name="whatsapp"
            type="tel"
            autoComplete="tel"
            maxLength={25}
            placeholder="(11) 99999-9999"
            {...fieldProps("whatsapp")}
          />
          <span className="sr-only" id="whatsapp-hint">
            DDD e número brasileiro, com código +55 opcional.
          </span>
          {error("whatsapp")}
        </div>
      </fieldset>
      <p id="contact-purpose" className="contact-purpose">
        Ao enviar, seus dados serão encaminhados por e-mail à equipe Zelora para
        entrar em contato sobre a plataforma. Isso não autoriza mensagens
        adicionais de marketing.
      </p>
      <button
        type="submit"
        className="button form-submit"
        disabled={status === "sending" || status === "sent"}
      >
        {status === "sending"
          ? "Enviando…"
          : status === "sent"
            ? "Interesse enviado"
            : "Quero conhecer o Zelora"}{" "}
        <ArrowUpRight size={18} />
      </button>
      <div
        role="status"
        aria-live="polite"
        className={
          message
            ? `validation-notice${status === "error" ? " send-error" : ""}`
            : "sr-only"
        }
      >
        {message}
      </div>
    </form>
  );
}
