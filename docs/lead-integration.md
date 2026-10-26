# Envio de interessados por e-mail

O formulário envia `POST /api/interests` ao servidor Next.js. A rota valida os campos e usa a API REST do Resend para encaminhar nome, e-mail, tipo de estabelecimento e WhatsApp opcional para **gpego786@gmail.com**. O destinatário é fixo no servidor. O endereço do interessado é usado em `reply_to`, não como remetente.

## Configurar

1. Crie uma chave de envio no Resend e autorize um remetente de domínio verificado.
2. Copie `.env.example` para `.env.local` e preencha:

```dotenv
RESEND_API_KEY=re_sua_chave_privada
INTEREST_EMAIL_FROM=Zelora <contato@seu-dominio-verificado.com>
```

3. Configure `SITE_URL` com a origem pública real em produção. Reinicie o servidor após alterar as variáveis. Na hospedagem, configure os segredos no servidor, sem prefixo `NEXT_PUBLIC_`.
4. Execute o Next.js com suporte a rotas de servidor e acesso HTTPS a `api.resend.com`. Exportação puramente estática não executa o envio.
5. Faça um cadastro de teste, confira o registro no Resend e o recebimento no destino, inclusive spam. Sucesso significa aceite pelo provedor; não comprova entrega na caixa de entrada.

Não é necessário fornecer senha do Gmail. Sem chave/remetente, a rota retorna `503`, com erro na interface e preservação dos campos. Credenciais não vão para o navegador ou Git.

## Contrato e comportamento

Payload JSON: `{ "name": "Nome", "email": "nome@example.com", "establishmentType": "Barbearia", "whatsapp": "+5511999999999" }`.

Nome de 2 a 100 caracteres, e-mail válido até 254, tipo dentre as opções da interface e telefone brasileiro opcional com DDD. Validação compartilhada entre cliente e servidor; telefone normalizado com +55. Corpo limitado a 8 KiB; origens de navegador diferentes da aplicação são rejeitadas.

Respostas: `201` para aceite confirmado; `400` para JSON inválido; `403` para origem inválida; `413` para corpo excessivo; `415` para formato diferente de JSON; `422` com erros de campo; `429` para limite do provedor; `502` para falha, timeout ou resposta inesperada; `503` para configuração ausente. Detalhes internos do provedor não são expostos ao cliente, e a aplicação não registra dados pessoais em logs.

O botão fica bloqueado durante o envio e após sucesso, até edição dos campos. Tentativas com mesmo conteúdo normalizado usam a mesma chave de idempotência no Resend por 24 horas, inclusive após timeout. Alterar o conteúdo gera novo envio. Não há base de leads, fila persistente nem consentimento de marketing adicional. Os dados ficam no e-mail, sujeitos à retenção do provedor e da caixa de destino. Para volumes maiores, configure limites de requisição na hospedagem/WAF.

## Verificação

`corepack pnpm test:e2e` verifica o servidor com provedor simulado (destinatário, reply-to, campos, idempotência, validação e falhas) e o navegador (erro, preservação, envio pendente e sucesso). Não envia e-mails reais.

Referências: [API de envio](https://resend.com/docs/api-reference/emails/send-email), [idempotência](https://resend.com/docs/dashboard/emails/idempotency-keys).
