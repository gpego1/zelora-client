import { Plus } from "lucide-react";

const questions = [
  [
    "Para quais negócios o Zelora foi pensado?",
    "Para barbearias, salões de beleza, estúdios de unhas e sobrancelhas, centros de estética e profissionais autônomos de autocuidado. A proposta é organizar a operação desses negócios; não inclui prontuário ou gestão clínica.",
  ],
  [
    "Posso organizar a agenda de vários profissionais?",
    "Essa é uma funcionalidade prevista: visualizar horários por profissional, identificar disponibilidades e organizar bloqueios e agendamentos. O Zelora está em desenvolvimento; a prévia desta página é ilustrativa.",
  ],
  [
    "A proposta inclui produtos de revenda e insumos?",
    "Sim. Estão previstos registros de entradas, vendas, consumo e alertas de estoque baixo, diferenciando produtos de revenda dos insumos usados nos atendimentos. Esses recursos ainda não estão disponíveis nesta landing page.",
  ],
  [
    "Como funciona o controle de caixa?",
    "A proposta é registrar manualmente recebimentos e despesas, acompanhar abertura e fechamento e separar dinheiro, Pix e cartão. Registrar um pagamento não significa processar uma transação bancária. Movimentação líquida também não representa lucro.",
  ],
  [
    "Como posso conhecer a plataforma?",
    "Você pode explorar os exemplos desta página. O produto está em desenvolvimento e ainda não há cadastro de interesse conectado: o formulário abaixo é uma demonstração e não envia nem armazena os dados. A disponibilidade comercial não foi definida.",
  ],
];

export function Faq() {
  return (
    <section className="section container faq-section" id="perguntas">
      <div>
        <p className="eyebrow">BOM SABER, ANTES DE COMEÇAR</p>
        <h2>
          Vamos tirar
          <br />
          <em>as dúvidas?</em>
        </h2>
        <p>
          Uma proposta clara.
          <br />
          Sem promessas fora de hora.
        </p>
      </div>
      <div className="faq-list">
        {questions.map(([question, answer]) => (
          <details key={question}>
            <summary>
              {question}
              <Plus size={18} aria-hidden="true" />
            </summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
