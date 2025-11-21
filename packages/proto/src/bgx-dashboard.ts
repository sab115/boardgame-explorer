import { LitElement, html, css } from "lit";
import { property, state } from "lit/decorators.js";
import { define } from "@calpoly/mustang";
import "./bgx-card.ts";

interface CardData {
    title: string;
    iconRef: string;
    href: string;
    linkLabel: string;
}

export class BgxDashboard extends LitElement {
    @property() src?: string;
    @state() cards: CardData[] = [];

    static styles = css`
    :host {
      display: block;
    }
    .page-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: var(--space-3);
    }
  `;

    connectedCallback() {
        super.connectedCallback();
        if (this.src) this.hydrate(this.src);
    }

    async hydrate(src: string) {
        const res = await fetch(src);
        if (res.ok) this.cards = await res.json();
    }

    renderCard(c: CardData) {
        return html`
      <bgx-card icon-ref=${c.iconRef}>
        <span slot="title">${c.title}</span>
        <li><a href=${c.href}>${c.linkLabel}</a></li>
      </bgx-card>
    `;
    }

    render() {
        return html`
      <div class="page-grid">
        ${this.cards.map((c) => this.renderCard(c))}
      </div>
    `;
    }
}

define({ "bgx-dashboard": BgxDashboard });
