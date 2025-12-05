import { LitElement, html, css } from "lit";
import { property, state } from "lit/decorators.js";

interface CardData {
    title: string;
    icon: string;
    href: string;
    linkLabel: string;
    span?: string;
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
            grid-template-columns: repeat(12, minmax(0, 1fr));
            gap: var(--space-3);
        }
        .span-12 { grid-column: span 12; }
        .span-6  { grid-column: span 6; }
        .span-4  { grid-column: span 4; }

        @media (max-width: 1000px) {
            .page-grid { grid-template-columns: repeat(8, minmax(0, 1fr)); }
            .span-6, .span-4 { grid-column: span 4; }
        }
        @media (max-width: 640px) {
            .page-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
            .span-12, .span-6, .span-4 { grid-column: span 4; }
        }
    `;

    connectedCallback() {
        super.connectedCallback();
        if (this.src) this.hydrate(this.src);
    }

    async hydrate(src: string) {
        try {
            const res = await fetch(src);
            if (res.ok) {
                this.cards = await res.json();
                console.log("Loaded cards:", this.cards);
            } else {
                console.error("Failed to fetch cards:", res.status);
            }
        } catch (error) {
            console.error("Error loading cards:", error);
        }
    }

    renderCard(c: CardData) {
        return html`
            <bgx-card 
                class="span-${c.span || '4'}"
                icon=${c.icon} 
                href=${c.href}>
                <span slot="title">${c.title}</span>
                <span slot="link-label">${c.linkLabel}</span>
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