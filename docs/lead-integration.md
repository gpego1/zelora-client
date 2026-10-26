# Ativação da captação de interesse

## Estado atual

Não existe endpoint de leads no repositório inspecionado. O formulário é exclusivamente demonstrativo: valida no navegador e mantém os valores no DOM, sem requisição, persistência, localStorage ou mensagem de cadastro concluído. Nenhuma variável de ambiente o transforma automaticamente em cadastro real. Não há analytics ou coleta de marketing.

## Contrato sugerido (não implementado)

Criar no backend um `POST /api/v1/interests`, na mesma origem por proxy. Payload JSON:

```json
{
  "name": "Nome da pessoa",
  "email": "nome@exemplo.com",
  "establishmentType": "Barbearia",
  "whatsapp": "+5511999999999"
}
```

`name`: obrigatório, trim, entre 2 e 100 caracteres. `email`: obrigatório, endereço válido, até 254 caracteres. `establishmentType`: obrigatório, enum sincronizado com as opções da interface. `whatsapp`: opcional, telefone brasileiro normalizado; aceitar DDD com 10/11 dígitos e prefixo 55 opcional. A ausência de consentimento de marketing significa nenhum marketing autorizado.

Respostas propostas: `201` com identificador opaco; `422` com `{ "errors": { "email": "mensagem" } }`; `429` para excesso de tentativas; `5xx` para falha temporária. Não devolver dados pessoais no corpo de resposta ou logs. Definir chave de idempotência por tentativa para evitar duplicação em repetição da mesma requisição.

## Trabalho necessário para ativar

1. Implementar persistência e validação no backend real, limites de requisição, tratamento de duplicatas e política de retenção. Confirmar finalidade, responsável pelo contato e destino real da política de privacidade.
2. Configurar URL privada do backend no servidor/proxy, HTTPS e origens permitidas. Não inserir credenciais em variáveis `NEXT_PUBLIC_*`.
3. Integrar o formulário ao contrato confirmado. Incluir estado de envio, botão desabilitado enquanto pendente, tratamento de erros de campo/servidor, preservação dos dados em falha e sucesso apenas após resposta confirmada. Remover os avisos de demonstração somente nessa entrega.
4. Caso marketing adicional seja desejado, incluir consentimento específico, separado, opcional e desmarcado. Registrar versão do consentimento no backend.
5. Verificar envio real, falha de rede, `422`, `429`, repetição e navegação por teclado em testes de integração. Atualizar a FAQ e este documento.

Ainda não há domínio confirmado; URL canônica e URLs absolutas de compartilhamento ficam pendentes. Nenhum preço, prazo comercial ou data de lançamento foi definido.
