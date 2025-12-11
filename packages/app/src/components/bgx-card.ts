import { LitElement, css, html } from "lit";
import { property } from "lit/decorators.js";
import reset from "../styles/reset.css.ts";

export class BgxCard extends LitElement {
    @property({ reflect: true }) icon: string = "dice";
    @property({ reflect: true }) href: string = "#";

    override render() {
        return html`
            <article class="card">
                <h2>
                    <svg class="icon" aria-hidden="true" focusable="false" width="22" height="22">
                        <use href=${`/icons/boardgame.svg#icon-${this.icon}`} />
                    </svg>
                    <slot name="title">Untitled</slot>
                </h2>

                <ul class="sequence-inline">
                    <li>
                        <a href=${this.href}>
                            <slot name="link-label">Browse</slot>
                        </a>
                    </li>
                </ul>
            </article>
        `;
    }

    static styles = [
        reset.styles,
        css`
            :host {
                display: block;
            }

            .card {
                background: var(--color-surface);
                border: 1px solid var(--color-border);
                border-radius: var(--radius-md);
                box-shadow: var(--shadow-sm);
                padding: var(--space-3);
            }

            h2 {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                color: var(--color-accent);
                font-family: var(--font-family-display);
                margin: 0 0 var(--space-2);
            }

            svg.icon {
                display: inline-block;
                height: 1.1em;
                width: 1.1em;
                vertical-align: middle;
                fill: currentColor;
                margin-right: 0.25rem;
            }

            .sequence-inline {
                display: flex;
                flex-direction: column;
                gap: 0.25rem;
                list-style: none;
                padding: 0;
                margin: 0.25rem 0 0;
            }

            a {
                color: var(--color-accent);
                text-decoration: none;
                font-weight: 500;
            }
            a:hover,
            a:focus {
                color: var(--color-accent-strong);
                text-decoration: underline;
            }
        `,
    ];
}