import { View } from "@calpoly/mustang";
import { css, html } from "lit";
import { property, state } from "lit/decorators.js";
import { Game } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";
import { Form, History } from "@calpoly/mustang";

export class GameEditElement extends View<Model, Msg> {
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
            <div class="game-edit-page">
                <header>
                    <h1>Edit: ${game.title}</h1>
                </header>
                <main>
                    <mu-form .init=${game} @mu-form:submit=${this.handleSubmit}>
                        <label>
                            <span>Title</span>
                            <input name="title" />
                        </label>
                        <label>
                            <span>Players</span>
                            <input name="players" />
                        </label>
                        <label>
                            <span>Play Time</span>
                            <input name="playTime" />
                        </label>
                        <label>
                            <span>Category</span>
                            <input name="category" />
                        </label>
                        <label>
                            <span>Mechanic</span>
                            <input name="mechanic" />
                        </label>
                        <label>
                            <span>Designer</span>
                            <input name="designer" />
                        </label>
                        <label>
                            <span>Publisher</span>
                            <input name="publisher" />
                        </label>
                        <button type="submit">Save Changes</button>
                    </mu-form>
                    <footer>
                        <a href="/app/games/${this.gameId}">Cancel</a>
                    </footer>
                </main>
            </div>
        `;
    }

    handleSubmit(event: Form.SubmitEvent<Game>) {
        this.dispatchMessage([
            "game/save",
            {
                gameId: this.gameId!,
                game: event.detail
            },
            {
                onSuccess: () =>
                    History.dispatch(this, "history/navigate", {
                        href: `/app/games/${this.gameId}`
                    }),
                onFailure: (error: Error) =>
                    console.log("ERROR:", error)
            }
        ]);
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
        main {
            background: var(--color-surface);
            border: 1px solid var(--color-border);
            border-radius: var(--radius-md);
            padding: var(--space-3);
        }
        label {
            display: block;
            margin-bottom: var(--space-2);
        }
        label span {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 600;
        }
        input {
            width: 100%;
            padding: 0.75rem;
            border: 2px solid var(--color-border);
            border-radius: 6px;
            font-size: 1rem;
        }
        input:focus {
            outline: none;
            border-color: var(--color-accent);
        }
        button {
            width: 100%;
            padding: 0.875rem;
            background: var(--color-accent);
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            margin-top: var(--space-2);
        }
        button:hover {
            background: var(--color-accent-strong);
        }
        footer {
            margin-top: var(--space-2);
        }
        a {
            color: var(--color-accent);
            text-decoration: none;
            font-weight: 500;
        }
    `;
}