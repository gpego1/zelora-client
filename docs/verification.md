# Verificação da landing

Revisão em 26/10/2026, Node.js 24.12.0, pnpm 12.15.0 e Chrome local via Playwright.

- `pnpm lint`: aprovado, sem avisos.
- `pnpm typecheck`: aprovado.
- `pnpm build`: aprovado; landing e imagens sociais geradas estaticamente.
- `pnpm test:e2e`: 8 testes aprovados no build de produção.
- `git diff --check`: aprovado.

As verificações no navegador cobrem 320, 390, 768, 1024 e 1440 px, ausência de rolagem horizontal, destinos de todos os links internos, ausência de erros JavaScript nas páginas, menu e FAQ por teclado, link para pular navegação, movimento reduzido e metadados. O formulário foi verificado vazio, com telefone inválido, com telefone válido e sem telefone, preservando os valores e sem POST ou uso de localStorage.

Capturas de desktop e celular foram inspecionadas visualmente, incluindo hero, prévia de agenda e formulário. Corrigida a extrapolação horizontal causada pela transformação do fundo decorativo. A prévia móvel mostra duas métricas, textos maiores e duas agendas; o resumo completo permanece no desktop. O header móvel mantém a chamada em uma linha. Campos móveis usam 16 px para evitar zoom automático de foco no iOS.

Limitação conhecida: sem `SITE_URL`, o Next.js emite aviso de `metadataBase` e resolve imagens sociais com localhost. Configure a origem pública real antes do build destinado à publicação. Nenhum domínio ou URL canônica foi inventado. A captação real depende do backend descrito em `lead-integration.md`; o formulário atual é uma demonstração.

Não houve deploy, merge ou alteração no backend.
