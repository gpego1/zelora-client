import {
  CalendarDays,
  Users,
  Package,
  Wallet,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  ArrowDownLeft,
  ArrowUpRight,
  Scissors,
  Bell,
  Leaf,
} from "lucide-react";

export function ProductPreview() {
  return (
    <figure
      className="preview-scene"
      aria-label="Prévia ilustrativa da agenda e dos resumos do Zelora, com dados fictícios"
    >
      <div className="preview-topline">
        <span className="tiny-dot" /> UM OLHAR PARA A SUA NOVA ROTINA{" "}
        <span>01 / 04</span>
      </div>
      <div className="product-window">
        <aside className="preview-sidebar" aria-hidden="true">
          <span className="mini-brand">z.</span>
          {[LayoutDashboard, CalendarDays, Users, Package, Wallet].map(
            (Icon, i) => (
              <span key={i} className={i === 1 ? "selected" : ""}>
                <Icon size={17} />
              </span>
            ),
          )}
          <Leaf className="sidebar-bottom" size={18} />
        </aside>
        <div className="preview-main">
          <div className="app-heading">
            <div>
              <span className="micro-label">
                ESPAÇO AURORA · DADOS FICTÍCIOS
              </span>
              <h3>Um bom dia começa aqui.</h3>
            </div>
            <span className="app-avatar">MA</span>
          </div>
          <div className="preview-stats">
            <div>
              <span>
                <ArrowDownLeft size={13} /> Entradas do dia
              </span>
              <strong>
                R$ 480<span>,00</span>
              </strong>
            </div>
            <div>
              <span>
                <ArrowUpRight size={13} /> Saídas do dia
              </span>
              <strong>
                R$ 120<span>,00</span>
              </strong>
            </div>
            <div>
              <span>Movimentação líquida</span>
              <strong>
                R$ 360<span>,00</span>
              </strong>
            </div>
          </div>
          <div className="agenda-toolbar">
            <h4>
              <CalendarDays size={16} /> Agenda do dia
            </h4>
            <span>
              Seg, 26 de outubro <ChevronLeft size={12} />
              <ChevronRight size={12} />
            </span>
          </div>
          <div className="schedule">
            <div className="schedule-head">
              <span>Horário</span>
              <span>
                <i className="avatar peach">MC</i> Marina
              </span>
              <span>
                <i className="avatar sage">RL</i> Rafael
              </span>
            </div>
            <div className="schedule-row">
              <time>09:00</time>
              <div className="appointment green">
                <b>Ana Oliveira</b>
                <span>Corte + finalização</span>
                <small>09:00 – 10:00</small>
              </div>
              <div className="appointment lavender">
                <b>Lucas Santos</b>
                <span>Corte masculino</span>
                <small>09:00 – 09:45</small>
              </div>
            </div>
            <div className="schedule-row">
              <time>10:00</time>
              <div className="appointment peach">
                <b>Beatriz Lima</b>
                <span>Coloração</span>
                <small>10:00 – 11:30</small>
              </div>
              <div className="free-slot">Horário disponível</div>
            </div>
            <div className="schedule-row last">
              <time>11:00</time>
              <div className="continuation">
                <span>Em atendimento</span>
              </div>
              <div className="appointment green">
                <b>Pedro Costa</b>
                <span>Corte + barba</span>
                <small>11:00 – 12:00</small>
              </div>
            </div>
          </div>
          <div className="preview-foot">
            <span className="tiny-dot" /> Tudo à vista. Cada detalhe no seu
            lugar.
          </div>
        </div>
      </div>
      <div className="stock-note">
        <span className="stock-icon">
          <Package size={19} />
        </span>
        <div>
          <b>Um cuidado com o estoque</b>
          <span>Óleo para barba · 2 un. restantes</span>
        </div>
        <Bell size={15} />
      </div>
      <figcaption>
        <Scissors size={13} /> Prévia ilustrativa · produto em desenvolvimento
      </figcaption>
    </figure>
  );
}
