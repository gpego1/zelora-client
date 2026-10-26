"use client";

import { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <a href="#inicio" className="wordmark" aria-label="Zelora, início">
          <span className="brand-symbol" aria-hidden="true">
            z
          </span>
          zelora<span className="brand-dot">.</span>
        </a>
        <nav aria-label="Navegação principal" className="desktop-nav">
          <a href="#funcionalidades">Funcionalidades</a>
          <a href="#como-funciona">Como funciona</a>
          <a href="#para-quem">Para quem</a>
        </nav>
        <a className="button small header-cta" href="#interesse">
          Quero conhecer <ArrowUpRight size={16} />
        </a>
        <button
          className="menu-toggle"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
        {open && (
          <nav
            id="mobile-nav"
            className="mobile-nav"
            aria-label="Navegação no celular"
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setOpen(false);
                document
                  .querySelector<HTMLButtonElement>(".menu-toggle")
                  ?.focus();
              }
            }}
          >
            {[
              ["#funcionalidades", "Funcionalidades"],
              ["#como-funciona", "Como funciona"],
              ["#para-quem", "Para quem"],
              ["#interesse", "Quero conhecer"],
            ].map(([href, label]) => (
              <a key={href} href={href} onClick={() => setOpen(false)}>
                {label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
