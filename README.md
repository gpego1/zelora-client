# Zelora · landing page

Next.js App Router, React, TypeScript, Tailwind CSS e Lucide. Node.js 24 LTS e pnpm 12.15.0 (via Corepack).

## Executar

```sh
corepack pnpm install --frozen-lockfile
corepack pnpm dev
```

Abra http://localhost:3000. Verificações: `corepack pnpm lint`, `corepack pnpm typecheck`, `corepack pnpm build`.

## Escopo e decisões

O remoto estava vazio na inspeção de 26/10/2026, sem branch padrão publicada, instruções locais, aplicação administrativa, autenticação ou endpoint de leads. A landing ocupa `/`; nenhuma rota existente foi substituída. O arquivo `prompt.md` no diretório pai é uma referência de escopo maior; esta implementação atende somente ao pedido de landing page.

Direção visual editorial, marfim, verde profundo, detalhes pêssego e títulos em Georgia com fonte de interface Trebuchet MS. Fontes locais evitam chamadas a provedores externos. A prévia é HTML/CSS, com dados fictícios e sem controles simulados. Entradas de R$ 480 menos saídas de R$ 120 resultam em movimentação líquida de R$ 360, sem representar lucro ou saldo de dinheiro físico.

O produto é apresentado como em desenvolvimento. Os recursos descritos são a proposta, não comprovação de implementação do sistema administrativo.

## Formulário e configuração

O formulário é uma demonstração com validação local: não envia, não armazena e não confirma cadastro. O contrato sugerido e os requisitos para a integração real estão em [docs/lead-integration.md](docs/lead-integration.md).

Copie `.env.example` para `.env.local` e defina `SITE_URL` com a origem pública real antes do build de produção. Essa variável configura as URLs absolutas das imagens sociais; sem ela o Next.js usa localhost em desenvolvimento. Não há domínio confirmado nem URL canônica configurada.

## Verificação no navegador

```sh
corepack pnpm build
corepack pnpm test:e2e
```

Os testes usam Chrome instalado (`channel: chrome`) e iniciam o servidor de produção automaticamente. Se necessário, instale o navegador com `corepack pnpm exec playwright install chrome`. Cobrem larguras de 320, 390, 768, 1024 e 1440 px, links internos, menu e FAQ por teclado, metadados, movimento reduzido e validação sem envio ou persistência. Capturas locais ficam em `.artifacts/`, fora do Git.

## Incrementos

1. Fundação, header, hero e prévia ilustrativa.
2. Recursos, rotina conectada, como funciona e públicos.
3. FAQ, formulário demonstrativo e contrato de integração.
4. Verificação responsiva, acessibilidade e metadados sociais.

Cada incremento passa por verificações e commit/push na branch `feat/zelora-landing`. Não há deploy automático, analytics, preços ou alegações comerciais não verificadas.
