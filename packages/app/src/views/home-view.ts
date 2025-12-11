import {View } from "@calpoly/mustang";
import { css, html } from "lit";
import { state } from "lit/decorators.js";
import { Model } from "../model";
import { Msg } from "../messages";
import "../components/bgx-dashboard";

export class HomeViewElement extends View<Model, Msg> {
    @state()
    get cards() {
        return this.model.dashboard;
    }

    constructor() {
        super("bgx:model");
    }

    connectedCallback() {
        super.connectedCallback();

        if (!this.cards) {
            this.dispatchMessage(["cards/request", {}]);
        }
    }

    render() {
        return html`
      <bgx-dashboard .cards=${this.cards || []}></bgx-dashboard>
    `;
    }

    static styles = css`
        :host {
            display: block;
        }
    `;
}