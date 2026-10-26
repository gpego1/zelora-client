import {
  ArrowRight,
  Check,
  Scissors,
  Sparkles,
  CalendarCheck,
  ClipboardCheck,
  PackageMinus,
  Wallet,
  ChartNoAxesCombined,
} from "lucide-react";

export function ProductSections() {
  return (
    <>
      <section
        className="feature-stories container"
        aria-label="Exemplos dos recursos previstos"
      >
        <article className="feature-story agenda-story">
          <div>
            <p className="eyebrow">01 / AGENDA & EQUIPE</p>
            <h3>
              Um lugar para cada horário.
              <br />
              <em>Um ritmo para toda a equipe.</em>
            </h3>
            <p>
              Encontre os espaços livres sem percorrer conversas. A proposta é
              reunir a agenda de cada profissional e o agendamento online em uma
              visão organizada.
            </p>
            <a href="#como-funciona" className="text-link">
              Veja como começa <ArrowRight size={15} />
            </a>
          </div>
          <div className="mini-agenda">
            <span className="example-label">EXEMPLO ILUSTRATIVO</span>
            <div className="mini-agenda-title">
              <span>Terça-feira</span>
              <b>27 out.</b>
            </div>
            {[
              ["09:00", "Corte e finalização", "Marina · 60 min", "green"],
              ["10:00", "Horário livre", "Marina · disponível", "free"],
              ["11:00", "Design de sobrancelhas", "Camila · 30 min", "peach"],
            ].map(([time, title, detail, color]) => (
              <div className="mini-agenda-row" key={time}>
                <time>{time}</time>
                <div className={color}>
                  <b>{title}</b>
                  <span>{detail}</span>
                </div>
              </div>
            ))}
          </div>
        </article>
        <div className="feature-pair">
          <article className="feature-story client-story">
            <div>
              <p className="eyebrow">02 / CLIENTES</p>
              <h3>
                Cada cliente tem uma história.
                <br />
                <em>Continue de onde parou.</em>
              </h3>
              <p>
                Informações e histórico por perto para preparar o próximo
                atendimento com atenção aos detalhes.
              </p>
            </div>
            <div className="client-example">
              <div className="client-profile">
                <span>AL</span>
                <div>
                  <b>Ana Lima</b>
                  <small>Cliente fictícia</small>
                </div>
                <span className="soft-tag">Histórico</span>
              </div>
              <div className="client-history">
                <span>12 OUT</span>
                <div>
                  <b>Corte + hidratação</b>
                  <small>Profissional: Marina</small>
                </div>
                <Check size={15} />
              </div>
              <p>Preferência registrada: finalização natural.</p>
            </div>
          </article>
          <article className="feature-story stock-story">
            <div>
              <p className="eyebrow">03 / ESTOQUE & CAIXA</p>
              <h3>
                Do produto na prateleira
                <br />
                <em>ao valor que entrou.</em>
              </h3>
              <p>
                Acompanhe produtos de revenda e insumos. Registre recebimentos e
                despesas, separando dinheiro, Pix e cartão.
              </p>
            </div>
            <div className="stock-example">
              <span className="example-label">EXEMPLO ILUSTRATIVO</span>
              <div>
                <span>
                  Máscara de hidratação <small>Insumo · unidade: g</small>
                </span>
                <b>
                  250 g <small>Em estoque</small>
                </b>
              </div>
              <div>
                <span>
                  Recebimento · corte <small>Registro manual · Pix</small>
                </span>
                <b>
                  R$ 80,00 <small>Entrada registrada</small>
                </b>
              </div>
              <p>
                O registro organiza o caixa; não realiza uma transação bancária.
              </p>
            </div>
          </article>
        </div>
      </section>
      <section className="how-section" id="como-funciona">
        <div className="container section">
          <p className="eyebrow">O COMEÇO PODE SER SIMPLES</p>
          <div className="section-heading">
            <h2>
              Seu jeito de trabalhar.
              <br />
              <em>Uma rotina mais organizada.</em>
            </h2>
            <p>
              Três passos que orientam a experiência
              <br />
              que estamos construindo.
            </p>
          </div>
          <ol className="steps">
            {[
              [
                "01",
                "Prepare o seu espaço",
                "Cadastre seu negócio, os serviços oferecidos e os profissionais da equipe.",
              ],
              [
                "02",
                "Abra a sua agenda",
                "Organize a operação e compartilhe seu link de agendamento com os clientes.",
              ],
              [
                "03",
                "Acompanhe o dia a dia",
                "Veja os atendimentos da equipe, os níveis de estoque e as movimentações financeiras.",
              ],
            ].map(([number, title, description]) => (
              <li key={number}>
                <span className="step-number">{number}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="section container routine">
        <div className="routine-intro">
          <p className="eyebrow">TUDO CONECTADO, COM MAIS CLAREZA</p>
          <h2>
            Um atendimento organizado.
            <br />
            <em>Do início ao fim.</em>
          </h2>
          <p>
            Os detalhes acompanham o atendimento. Assim, você sabe o que
            aconteceu e o que precisa ser registrado em cada etapa.
          </p>
          <span className="outline-tag">
            Fluxo previsto · exemplo ilustrativo
          </span>
        </div>
        <ol className="routine-flow">
          {[
            [
              CalendarCheck,
              "Agendamento registrado",
              "Cliente, serviço e horário no lugar certo.",
            ],
            [
              ClipboardCheck,
              "Atendimento realizado",
              "O serviço concluído entra no histórico.",
            ],
            [
              PackageMinus,
              "Insumos registrados",
              "O consumo fica visível no estoque.",
            ],
            [
              Wallet,
              "Pagamento lançado",
              "Valor e forma de recebimento registrados.",
            ],
            [
              ChartNoAxesCombined,
              "Indicadores atualizados",
              "Uma visão dos atendimentos e movimentos.",
            ],
          ].map(([Icon, title, description], i) => {
            const I = Icon as typeof Wallet;
            return (
              <li key={String(title)}>
                <span className="routine-icon">
                  <I size={20} />
                </span>
                <div>
                  <small>0{i + 1}</small>
                  <h3>{String(title)}</h3>
                  <p>{String(description)}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>
      <section id="para-quem" className="audience-section">
        <div className="container section">
          <div>
            <p className="eyebrow">O CUIDADO MUDA. A ORGANIZAÇÃO ACOMPANHA.</p>
            <h2>
              Para quem faz do cuidado
              <br />
              <em>o seu trabalho.</em>
            </h2>
            <p>
              Do espaço só seu à rotina de uma equipe.
              <br />
              Uma proposta pensada para negócios de beleza e autocuidado.
            </p>
            <a href="#interesse" className="button light">
              Vamos conhecer seu negócio <ArrowRight size={17} />
            </a>
          </div>
          <ul className="audience-list">
            {[
              "Barbearias",
              "Salões de beleza",
              "Estúdios de unhas e sobrancelhas",
              "Centros de estética",
              "Profissionais autônomos",
            ].map((label, i) => (
              <li key={label}>
                <span>0{i + 1}</span>
                {label}
                {i === 0 ? <Scissors size={19} /> : <Sparkles size={18} />}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
