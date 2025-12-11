import { LitElement, html, css } from "lit";
import { state } from "lit/decorators.js";
import { Auth, Observer, Events } from "@calpoly/mustang";

export class BgxHeader extends LitElement {
    @state()
    loggedIn = false;

    @state()
    userid?: string;

    _authObserver = new Observer<Auth.Model>(this, "bgx:auth");

    connectedCallback() {
        super.connectedCallback();
        this._authObserver.observe((auth: Auth.Model) => {
            const { user } = auth;
            if (user && user.authenticated) {
                this.loggedIn = true;
                this.userid = user.username;
            } else {
                this.loggedIn = false;
                this.userid = undefined;
            }
        });
    }

    render() {
        return html`
            <header class="site-header">
                <div class="brand">
                    <a href="/">
                        <h1>Board Game Explorer</h1>
                    </a>
                </div>
                
                <label class="theme-toggle">
                    <input id="dark-toggle" type="checkbox" autocomplete="off" />
                    Dark mode
                </label>
                
                <nav aria-label="Primary">
                    <ul>
                        <li><a href="/games/index.html">Games</a></li>
                        <li><a href="/categories/index.html">Categories</a></li>
                        <li><a href="/mechanics/index.html">Mechanics</a></li>
                        <li><a href="/designers/index.html">Designers</a></li>
                        <li><a href="/publishers/index.html">Publishers</a></li>
                        <li><a href="/expansions/index.html">Expansions</a></li>
                    </ul>
                </nav>
                
                <div class="auth-controls">
                    ${this.loggedIn ? this.renderSignedIn() : this.renderSignedOut()}
                </div>
            </header>
        `;
    }

    renderSignedIn() {
        return html`
            <span class="username">Hello, ${this.userid}</span>
            <button class="sign-out-btn" @click=${this.handleSignOut}>
                Sign Out
            </button>
        `;
    }

    renderSignedOut() {
        return html`
            <a href="/login.html" class="sign-in-link">Sign In</a>
        `;
    }

    handleSignOut(e: Event) {
        Events.relay(e, "auth:message", ["auth/signout"]);
    }

    static styles = css`
        :host {
            display: block;
        }

        .site-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: var(--space-2);
            padding: var(--space-2) var(--space-3);
            background: var(--color-background-header);
            color: var(--color-text-inverted);
            border-bottom: 1px solid rgba(255, 255, 255, 0.15);
            flex-wrap: wrap;
        }

        .brand a {
            text-decoration: none;
            color: inherit;
        }

        .brand h1 {
            margin: 0;
            font-size: var(--font-size-xl);
            color: var(--color-header-title);
            border-bottom: 4px solid var(--color-accent);
            padding-bottom: var(--space-1);
        }

        .theme-toggle {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            cursor: pointer;
        }

        nav ul {
            list-style: none;
            display: flex;
            gap: 1rem;
            padding: 0;
            margin: 0;
        }

        nav a {
            color: var(--color-text-inverted);
            text-decoration: none;
            opacity: 0.9;
            transition: opacity 0.2s;
        }

        nav a:hover,
        nav a:focus {
            opacity: 1;
            text-decoration: underline;
        }

        .auth-controls {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .username {
            color: var(--color-text-inverted);
            font-weight: 500;
        }

        .sign-out-btn {
            padding: 0.5rem 1rem;
            background: var(--color-accent);
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 500;
            transition: background 0.2s;
        }

        .sign-out-btn:hover {
            background: var(--color-accent-strong);
        }

        .sign-in-link {
            padding: 0.5rem 1rem;
            background: var(--color-accent);
            color: white;
            text-decoration: none;
            border-radius: 4px;
            font-weight: 500;
            transition: background 0.2s;
        }

        .sign-in-link:hover {
            background: var(--color-accent-strong);
        }

        @media (max-width: 768px) {
            .site-header {
                flex-direction: column;
                align-items: flex-start;
            }

            nav ul {
                flex-wrap: wrap;
            }
        }
    `;
}