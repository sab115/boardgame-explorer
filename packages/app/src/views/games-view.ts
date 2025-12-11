import { View } from "@calpoly/mustang";
import { css, html } from "lit";
import { state } from "lit/decorators.js";
import { Game } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";

export class GamesViewElement extends View<Model, Msg> {
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

    async loadGames() {
        this.loading = true;
        this.error = "";

        try {
            // Just use fetch without auth headers - the cookie will be sent automatically
            const response = await fetch("/api/games");

            if (response.ok) {
                this.games = await response.json();
                console.log("Loaded games:", this.games);
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
        if (this.loading) {
            return html`
                <div class="games-list-page">
                    <header>
                        <h1>Board Games</h1>
                    </header>
                    <main>
                        <p>Loading games...</p>
                    </main>
                </div>
            `;
        }

        if (this.error) {
            return html`
                <div class="games-list-page">
                    <header>
                        <h1>Board Games</h1>
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
                <div class="games-list-page">
                    <header>
                        <h1>Board Games</h1>
                    </header>
                    <main>
                        <p>No games found. Add some games to get started!</p>
                    </main>
                </div>
            `;
        }

        return html`
            <div class="games-list-page">
                <header>
                    <h1>Board Games</h1>
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
                                    <li><strong>Mechanic:</strong> ${game.mechanic}</li>
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
        }

        h1 {
            margin: 0;
            color: var(--color-accent);
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