import { LitElement, html, css } from "lit";
import { property, state } from "lit/decorators.js";
import { Auth, Observer } from "@calpoly/mustang";

interface CardData {
    _id?: string;
    title: string;
    icon: string;
    href: string;
    linkLabel: string;
    span?: string;
}

export class BgxDashboard extends LitElement {
    @property() src?: string;
    @state() cards: CardData[] = [];

    _authObserver = new Observer<Auth.Model>(this, "bgx:auth");
    _user?: Auth.User;

    static styles = css`
        :host {
            display: block;
        }
        .page-grid {
            display: grid;
            grid-template-columns: repeat(12, minmax(0, 1fr));
            gap: var(--space-3, 1.5rem);
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

    get authorization() {
        return (
            this._user?.authenticated && {
                Authorization: `Bearer ${(this._user as Auth.AuthenticatedUser).token}`
            }
        );
    }

    connectedCallback() {
        super.connectedCallback();
        this._authObserver.observe((auth: Auth.Model) => {
            this._user = auth.user;
            // Refetch data when auth state changes
            if (this.src && this._user?.authenticated) {
                this.hydrate(this.src);
            }
        });
    }

    async hydrate(src: string) {
        console.log("Fetching from:", src);
        try {
            const res = await fetch(src, {
                headers: this.authorization || {}
            });
            console.log("Response status:", res.status);

            if (res.ok) {
                const data = await res.json();
                console.log("Loaded cards:", data);
                this.cards = data;
            } else if (res.status === 401) {
                console.error("Unauthorized - user needs to log in");
            } else {
                console.error("Failed to fetch cards. Status:", res.status);
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
        if (!this._user?.authenticated) {
            return html`<div>Please <a href="/login.html">log in</a> to view content.</div>`;
        }

        if (this.cards.length === 0) {
            return html`<div>Loading cards...</div>`;
        }

        return html`
            <div class="page-grid">
                ${this.cards.map((c) => this.renderCard(c))}
            </div>
        `;
    }
}