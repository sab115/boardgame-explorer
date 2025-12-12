import { View } from "@calpoly/mustang";
import { css, html } from "lit";
import { state, property } from "lit/decorators.js";
import { Game } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";

export class GamesByMechanicViewElement extends View<Model, Msg> {
    @property()
    mechanic?: string;

    @state()
    games: Game[] = [];

    @state()
    loading = true;

    @state()
    error = "";

    constructor() {
        super("bgx:model");
    }

    connectedCallback() {
        super.connectedCallback();
        this.loadGames();
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        super.attributeChangedCallback(name, oldValue, newValue);
        if (name === "mechanic" && oldValue !== newValue) {
            this.loadGames();
        }
    }

    async loadGames() {
        if (!this.mechanic) return;

        this.loading = true;
        this.error = "";

        try {
            const response = await fetch("/api/games");

            if (response.ok) {
                const allGames: Game[] = await response.json();
                // Filter games by mechanic
                this.games = allGames.filter(game =>
                    game.mechanic.toLowerCase() === this.mechanic?.toLowerCase()
                );
                console.log(`Loaded ${this.games.length} games for mechanic: ${this.mechanic}`);
            } else {
                this.error = `Failed to load games: ${response.status}`;
                console.error(this.error);
            }
        } catch (err) {
            this.error = "Failed to load games";
            console.error("Failed to load games:", err);
        } finally {
            this.loading = false;
        }
    }

    render() {
        const mechanicDisplay = this.mechanic?.replace(/-/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        if (this.loading) {
            return html`
                <div class="mechanic-games-page">
                    <header>
                        <h1>${mechanicDisplay}</h1>
                        <a href="/app/mechanics" class="back-link">← Back to Mechanics</a>
                    </header>
                    <main>
                        <p>Loading games...</p>
                    </main>
                </div>
            `;
        }

        if (this.error) {
            return html`
                <div class="mechanic-games-page">
                    <header>
                        <h1>${mechanicDisplay}</h1>
                        <a href="/app/mechanics" class="back-link">← Back to Mechanics</a>
                    </header>
                    <main>
                        <p class="error">${this.error}</p>
                        <button @click=${this.loadGames}>Retry</button>
                    </main>
                </div>
            `;
        }

        if (this.games.length === 0) {
            return html`
                <div class="mechanic-games-page">
                    <header>
                        <h1>${mechanicDisplay}</h1>
                        <a href="/app/mechanics" class="back-link">← Back to Mechanics</a>
                    </header>
                    <main>
                        <p>No games found with this mechanic.</p>
                    </main>
                </div>
            `;
        }

        return html`
            <div class="mechanic-games-page">
                <header>
                    <h1>${mechanicDisplay}</h1>
                    <p class="subtitle">${this.games.length} game${this.games.length !== 1 ? 's' : ''}</p>
                    <a href="/app/mechanics" class="back-link">← Back to Mechanics</a>
                </header>
                <main>
                    <div class="games-grid">
                        ${this.games.map(game => html`
                            <article class="game-card">
                                <h2>
                                    <a href="/app/games/${game._id}">${game.title}</a>
                                </h2>
                                <ul>
                                    <li><strong>Players:</strong> ${game.players}</li>
                                    <li><strong>Time:</strong> ${game.playTime}</li>
                                    <li><strong>Category:</strong> ${game.category}</li>
                                    <li><strong>Designer:</strong> ${game.designer}</li>
                                </ul>
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
            padding-bottom: var(--space-2);
        }
        
        h1 {
            margin: 0;
            color: var(--color-accent);
        }

        .subtitle {
            margin: var(--space-1) 0;
            color: var(--color-text-muted);
            font-size: 1.1rem;
        }

        .back-link {
            display: inline-block;
            margin-top: var(--space-2);
            color: var(--color-accent);
            text-decoration: none;
            font-weight: 500;
        }

        .back-link:hover {
            text-decoration: underline;
        }
        
        .games-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: var(--space-3);
        }
        
        .game-card {
            background: var(--color-surface);
            border: 1px solid var(--color-border);
            border-radius: var(--radius-md);
            padding: var(--space-3);
            box-shadow: var(--shadow-sm);
            transition: transform 0.2s, box-shadow 0.2s;
        }

        .game-card:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-md);
        }
        
        .game-card h2 {
            margin: 0 0 var(--space-2);
            font-size: 1.25rem;
        }
        
        .game-card a {
            color: var(--color-accent);
            text-decoration: none;
        }
        
        .game-card a:hover {
            text-decoration: underline;
        }
        
        ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        
        li {
            margin: 0.5rem 0;
            color: var(--color-text);
        }

        .error {
            color: red;
            font-weight: bold;
        }

        button {
            padding: 0.5rem 1rem;
            background: var(--color-accent);
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 1rem;
        }

        button:hover {
            background: var(--color-accent-strong);
        }
    `;
}