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
        </header>
        <main>
            <section>
                <h2>Details</h2>
                <ul>
                    <li>Players: ${game.players}</li>
                    <li>Play Time: ${game.playTime}</li>
                    <li>Category: ${game.category}</li>
                    <li>Mechanic: ${game.mechanic}</li>
                    <li>Designer: ${game.designer}</li>
                    <li>Publisher: ${game.publisher}</li>
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
    }
    h1 {
      margin: 0;
        color: var(--color-accent)
    }
    section {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: var(--space-3);
      margin-bottom: var(--space-3);
    }
    a {
      color: var(--color-accent);
      text-decoration: none;
      font-weight: 500;
    }
    a:hover {
      text-decoration: underline;
    }
  `;
}