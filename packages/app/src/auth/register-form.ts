import { html, css, LitElement } from "lit";
import { property, state } from "lit/decorators.js";

interface RegisterFormData {
    username?: string;
    password?: string;
}

export class RegisterFormElement extends LitElement {
    @state()
    formData: RegisterFormData = {};

    @property()
    api?: string;

    @property()
    redirect: string = "/";

    @state()
    error?: string;

    @state()
    success: boolean = false;

    get canSubmit(): boolean {
        return Boolean(
            this.api &&
            this.formData.username &&
            this.formData.password &&
            this.formData.password.length >= 6
        );
    }

    static styles = css`
        :host {
            display: block;
        }
        
        button {
            width: 100%;
        }
        
        .error {
            color: red;
            padding: 0.5rem;
            border: 1px solid red;
            border-radius: 4px;
            margin-top: 1rem;
        }
        
        .success {
            color: green;
            padding: 0.5rem;
            border: 1px solid green;
            border-radius: 4px;
            margin-top: 1rem;
        }
    `;

    override render() {
        return html`
            <form
                @change=${(e: InputEvent) => this.handleChange(e)}
                @submit=${(e: SubmitEvent) => this.handleSubmit(e)}
            >
                <slot></slot>
                <button
                    ?disabled=${!this.canSubmit}
                    type="submit"
                >
                    Create Account
                </button>
                ${this.error ? html`<p class="error">${this.error}</p>` : ''}
                ${this.success ? html`<p class="success">Account created! Redirecting...</p>` : ''}
            </form>
        `;
    }

    handleChange(event: InputEvent) {
        const target = event.target as HTMLInputElement;
        const name = target?.name;
        const value = target?.value;
        const prevData = this.formData;

        switch (name) {
            case "username":
                this.formData = { ...prevData, username: value };
                break;
            case "password":
                this.formData = { ...prevData, password: value };
                break;
        }
    }

    handleSubmit(submitEvent: SubmitEvent) {
        submitEvent.preventDefault();

        if (this.canSubmit) {
            fetch(this.api || "", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(this.formData)
            })
                .then((res) => {
                    if (res.status !== 201) {
                        return res.json().then(err => {
                            throw new Error(err.error || "Registration failed");
                        });
                    }
                    return res.json();
                })
                .then((json: object) => {
                    const { token } = json as { token: string };
                    this.success = true;
                    this.error = undefined;

                    const customEvent = new CustomEvent(
                        'auth:message', {
                            bubbles: true,
                            composed: true,
                            detail: [
                                'auth/signin',
                                { token, redirect: this.redirect }
                            ]
                        }
                    );

                    setTimeout(() => {
                        this.dispatchEvent(customEvent);
                    }, 1000);
                })
                .catch((error: Error) => {
                    console.error(error);
                    this.error = error.message;
                    this.success = false;
                });
        }
    }
}