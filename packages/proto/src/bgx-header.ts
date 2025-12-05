import { LitElement, html } from "lit";
import { state } from "lit/decorators.js";
import { Auth, Observer, Events } from "@calpoly/mustang";

export class BgxHeader extends LitElement {
    private _authObserver = new Observer<Auth.Model>(this, "bgx:auth");

    @state()
    loggedIn = false;

    @state()
    userid?: string;

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

    private renderSignOutButton() {
        return html`
      <button
        @click=${(e: UIEvent) =>
            Events.relay(e, "auth:message", ["auth/signout"])}
      >
        Sign out ${this.userid ? `(${this.userid})` : ""}
      </button>
    `;
    }

    private renderSignInButton() {
        return html`<a href="/login.html">Sign in…</a>`;
    }

    override render() {
        return html`
      <header class="site-header">
        <div class="brand">
          <h1>Board Game Explorer</h1>
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

        <div class="user-controls">
          ${this.loggedIn
            ? this.renderSignOutButton()
            : this.renderSignInButton()}
        </div>
      </header>
    `;
    }

    protected createRenderRoot() {
        return this;
    }
}
