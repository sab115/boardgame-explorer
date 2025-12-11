import { View } from "@calpoly/mustang";
import { css, html } from "lit";
import { property, state } from "lit/decorators.js";
import { Game } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";

export class GameViewElement extends View<Model, Msg> {
    @property({ attribute: "game-id" })
    gameId?: string;

    @state()
    get game(): Game | undefined {
        return this.model.game;
    }

    constructor() {
        super("bgx:model");
    }

    connectedCallback() {
        super.connectedCallback();
        // Refetch when component connects
        if (this.gameId) {
            this.dispatchMessage(["game/request", { gameId: this.gameId }]);
        }
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        super.attributeChangedCallback(name, oldValue, newValue);
        if (name === "game-id" && oldValue !== newValue && newValue) {
            this.dispatchMessage(["game/request", { gameId: newValue }]);
        }
    }

    render() {
        const { game } = this;

        if (!game) return html`<div>Loading...</div>`;

        return html`
            <div class="game-page">
                <header>
                    <h1>${game.title}</h1>
                    <a href="/app/games/${this.gameId}/edit" class="edit-link">Edit</a>
                </header>
                <main>
                    <section>
                        <h2>Details</h2>
                        <ul>
                            <li><strong>Players:</strong> ${game.players}</li>
                            <li><strong>Play Time:</strong> ${game.playTime}</li>
                            <li><strong>Category:</strong> ${game.category}</li>
                            <li><strong>Mechanic:</strong> ${game.mechanic}</li>
                            <li><strong>Designer:</strong> ${game.designer}</li>
                            <li><strong>Publisher:</strong> ${game.publisher}</li>
                        </ul>
                    </section>
                    <footer>
                        <a href="/app">← Back to Dashboard</a>
                    </footer>
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
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        h1 {
            margin: 0;
            color: var(--color-accent);
        }
        .edit-link {
            padding: 0.5rem 1rem;
            background: var(--color-accent);
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
        }
        .edit-link:hover {
            background: var(--color-accent-strong);
        }
        section {
            background: var(--color-surface);
            border: 1px solid var(--color-border);
            border-radius: var(--radius-md);
            padding: var(--space-3);
            margin-bottom: var(--space-3);
        }
        ul {
            list-style: none;
            padding: 0;
        }
        li {
            margin: 0.5rem 0;
        }
        a {
            color: var(--color-accent);
            text-decoration: none;
            font-weight: 500;
        }
        a:not(.edit-link):hover {
            text-decoration: underline;
        }
    `;
}