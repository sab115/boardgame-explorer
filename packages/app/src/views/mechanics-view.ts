import { LitElement, css, html } from "lit";
import { state } from "lit/decorators.js";

export class MechanicsViewElement extends LitElement {
    @state()
    mechanics = [
        { id: "route-building", name: "Route Building", count: 1 },
        { id: "resource-management", name: "Resource Management", count: 1 },
        { id: "set-collection", name: "Set Collection", count: 1 },
        { id: "pattern-building", name: "Pattern Building", count: 1 },
        { id: "card-drafting", name: "Card Drafting", count: 3 },
        { id: "engine-building", name: "Engine Building", count: 2 },
        { id: "team-based-game", name: "Team Based Game", count: 1 }
    ];

    render() {
        return html`
            <div class="mechanics-page">
                <header>
                    <h1>Game Mechanics</h1>
                </header>
                <main>
                    <div class="mechanics-grid">
                        ${this.mechanics.map(mech => html`
                            <article class="mechanic-card">
                                <h2>${mech.name}</h2>
                                <p>${mech.count} game${mech.count !== 1 ? 's' : ''}</p>
                            </article>
                        `)}
                    </div>
                </main>
            </div>
        `;
    }

    static styles = css`
        :host {
            display: block;
            padding: var(--space-4);
        }
        
        header {
            border-bottom: 4px solid var(--color-accent);
            margin-bottom: var(--space-3);
        }
        
        h1 {
            margin: 0;
            color: var(--color-accent);
        }
        
        .mechanics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: var(--space-2);
        }
        
        .mechanic-card {
            background: var(--color-surface);
            border: 1px solid var(--color-border);
            border-radius: var(--radius-md);
            padding: var(--space-3);
            box-shadow: var(--shadow-sm);
        }
        
        .mechanic-card h2 {
            margin: 0 0 0.5rem;
            color: var(--color-accent);
            font-size: 1.25rem;
        }
        
        p {
            margin: 0;
            color: var(--color-text-muted);
        }
    `;
}