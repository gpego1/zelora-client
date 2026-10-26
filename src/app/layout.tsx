import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: process.env.SITE_URL
    ? new URL(process.env.SITE_URL)
    : undefined,
  title: "Zelora — Sua agenda organizada. Seu negócio no controle.",
  description:
    "Conheça a proposta do Zelora: agenda, clientes, estoque e caixa em um só lugar para negócios de beleza e autocuidado. Produto em desenvolvimento.",
  openGraph: {
    title: "Zelora — Mais cuidado, mais controle.",
    description:
      "Uma rotina mais organizada para o seu negócio de beleza. Conheça o Zelora, em desenvolvimento.",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zelora — Mais cuidado, mais controle.",
    description:
      "Agenda, clientes, estoque e caixa. Conheça a proposta do Zelora.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <a className="skip-link" href="#conteudo">
          Pular para o conteúdo
        </a>
        {children}
      </body>
    </html>
  );
}
