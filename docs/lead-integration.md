# Envio de interessados por SMTP

O formulário envia `POST /api/interests` ao servidor Next.js. Nodemailer encaminha nome, e-mail, tipo de estabelecimento e WhatsApp opcional por SMTP para **gpego786@gmail.com**. O destinatário é fixo no servidor; o e-mail do interessado é usado como `replyTo`.

## Configurar com Gmail

1. Ative a verificação em duas etapas na conta que enviará as mensagens.
2. Gere uma senha de app em https://myaccount.google.com/apppasswords. Contas gerenciadas ou com Proteção Avançada podem não oferecer essa opção.
3. Copie `.env.example` para `.env.local` (não sobrescreva configurações locais existentes) e preencha:

```dotenv
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=gpego786@gmail.com
SMTP_PASS=sua_senha_de_app_sem_espacos
INTEREST_EMAIL_FROM=
```

O remetente usa `SMTP_USER` por padrão. `INTEREST_EMAIL_FROM` é opcional e deve ser autorizado pelo provedor. Não use a senha normal da conta. Não é necessário Resend nem verificar um domínio próprio para enviar pela sua conta Gmail.

Para outro provedor, configure host, usuário e senha SMTP conforme suas instruções. A porta 465 usa TLS direto; a porta 587 exige STARTTLS. Outras portas são rejeitadas. Credenciais ficam somente no servidor, sem prefixo `NEXT_PUBLIC_` e fora do Git.

Reinicie o servidor após configurar as variáveis. Na hospedagem, adicione-as ao ambiente privado e confirme que conexões SMTP de saída são permitidas. O site precisa de runtime Node.js; exportação estática não executa o envio. Configure `SITE_URL` com a origem pública real em produção.

## Contrato e comportamento

Payload JSON: `{ "name": "Nome", "email": "nome@example.com", "establishmentType": "Barbearia", "whatsapp": "+5511999999999" }`.

Nome de 2 a 100 caracteres, e-mail válido até 254, tipo dentre as opções da interface e telefone brasileiro opcional com DDD. Validação compartilhada entre cliente e servidor; telefone normalizado com +55. Corpo limitado a 8 KiB e origem de navegador validada.

Respostas: `201` após aceite SMTP do destinatário; `400` para JSON inválido; `403` para origem inválida; `413` para corpo excessivo; `415` para formato diferente de JSON; `422` com erros de campo; `429` quando o limite de registros temporários da instância é atingido; `502` para erro ou rejeição SMTP; `503` para configuração ausente/inválida. Sucesso significa aceite pelo servidor SMTP, não entrega comprovada na caixa de entrada.

O botão bloqueia novos envios durante o processamento e após sucesso, até edição. Pedidos iguais e concorrentes são deduplicados por 10 minutos em memória na mesma instância. Falhas permitem nova tentativa. SMTP não fornece idempotência garantida: reinícios, múltiplas instâncias ou falhas após aceite podem gerar duplicatas. Para garantia entre instâncias, será necessária persistência compartilhada com fila e registro de entrega. Não há base de leads ou marketing adicional. Para maiores volumes, configure limites de requisição na hospedagem/WAF.

Não há logs de dados pessoais na aplicação. Os dados são armazenados na caixa de destino e sujeitos às políticas do provedor de e-mail.

## Verificação

`corepack pnpm test:e2e` verifica contrato, validação, configuração TLS, falhas, fechamento do transporte, destinatário fixo, deduplicação em memória e fluxo do formulário com transporte simulado. Não envia e-mails reais. Depois de configurar, faça um cadastro de teste e confira a caixa de destino, inclusive spam.

Referências: [SMTP no Nodemailer](https://nodemailer.com/smtp), [senhas de app Google](https://support.google.com/accounts/answer/185833?hl=pt-BR).
