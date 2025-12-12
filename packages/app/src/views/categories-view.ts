import { LitElement, css, html } from "lit";
import { state } from "lit/decorators.js";

export class CategoriesViewElement extends LitElement {
    @state()
    categories = [
        { id: "family-strategy", name: "Family Strategy", count: 2 },
        { id: "strategy", name: "Strategy", count: 1 },
        { id: "cooperative", name: "Cooperative", count: 1 },
        { id: "abstract-strategy", name: "Abstract Strategy", count: 1 },
        { id: "engine-building", name: "Engine Building", count: 1 },
        { id: "civilization", name: "Civilization", count: 1 },
        { id: "economic", name: "Economic", count: 1 },
        { id: "party", name: "Party", count: 1 }
    ];

    render() {
        return html`
            <div class="categories-page">
                <header>
                    <h1>Game Categories</h1>
                </header>
                <main>
                    <div class="categories-grid">
                        ${this.categories.map(cat => html`
                            <a href="/app/categories/${cat.id}" class="category-card-link">
                                <article class="category-card">
                                    <h2>${cat.name}</h2>
                                    <p>${cat.count} game${cat.count !== 1 ? 's' : ''}</p>
                                </article>
                            </a>
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

        .categories-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: var(--space-2);
        }

        .category-card-link {
            text-decoration: none;
            color: inherit;
        }

        .category-card {
            background: var(--color-surface);
            border: 1px solid var(--color-border);
            border-radius: var(--radius-md);
            padding: var(--space-3);
            box-shadow: var(--shadow-sm);
            transition: transform 0.2s, box-shadow 0.2s;
            cursor: pointer;
        }

        .category-card:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-md);
        }

        .category-card h2 {
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