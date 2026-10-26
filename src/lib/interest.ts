export const establishmentTypes = [
  "Barbearia",
  "Salão de beleza",
  "Estúdio de unhas e sobrancelhas",
  "Centro de estética",
  "Profissional autônomo",
  "Outro negócio de autocuidado",
];

export type Interest = {
  name: string;
  email: string;
  establishmentType: string;
  whatsapp: string;
};
export type Field = keyof Interest;
export type Errors = Partial<Record<Field, string>>;

export function validateInterest(input: unknown): {
  data: Interest;
  errors: Errors;
} {
  const record =
    input && typeof input === "object"
      ? (input as Record<string, unknown>)
      : {};
  const value = (field: Field) =>
    typeof record[field] === "string" ? record[field].trim() : "";
  const data: Interest = {
    name: value("name"),
    email: value("email").toLowerCase(),
    establishmentType: value("establishmentType"),
    whatsapp: value("whatsapp"),
  };
  const errors: Errors = {};
  if (
    data.name.length < 2 ||
    data.name.length > 100 ||
    /[\r\n\x00-\x1f]/.test(data.name)
  )
    errors.name = "Informe seu nome com 2 a 100 caracteres.";
  if (
    data.email.length > 254 ||
    !/^[^\s@<>\x00-\x1f]+@[^\s@<>\x00-\x1f]+\.[^\s@<>\x00-\x1f]+$/.test(
      data.email,
    )
  )
    errors.email = "Informe um e-mail válido, como nome@exemplo.com.";
  if (!establishmentTypes.includes(data.establishmentType))
    errors.establishmentType = "Selecione o tipo do seu negócio.";
  if (
    data.whatsapp &&
    (data.whatsapp.length > 25 ||
      !/^[+\d\s().-]+$/.test(data.whatsapp) ||
      !/^(?:55)?\d{10,11}$/.test(data.whatsapp.replace(/\D/g, "")))
  )
    errors.whatsapp =
      "Informe DDD e telefone, com 10 ou 11 dígitos. O código +55 é opcional.";
  if (!errors.whatsapp && data.whatsapp) {
    const digits = data.whatsapp.replace(/\D/g, "");
    data.whatsapp = `+${digits.length > 11 ? digits : `55${digits}`}`;
  }
  return { data, errors };
}
