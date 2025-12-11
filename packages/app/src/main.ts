import { Auth, define, History, Store, Switch, Form } from "@calpoly/mustang";
import { html } from "lit";
import { BgxHeader } from "./components/bgx-header";
import { HomeViewElement } from "./views/home-view";
import { GameViewElement } from "./views/game-view";
import { GameEditElement } from "./views/game-edit";
import { BgxDashboard } from "./components/bgx-dashboard";
import { BgxCard } from "./components/bgx-card";
import { Msg } from "./messages";
import { Model, init } from "./model";
import update from "./update";

const routes = [
    {
        path: "/app/games/:id/edit",
        view: (params: Switch.Params) => html`
            <game-edit game-id=${params.id}></game-edit>
        `
    },
    {
        path: "/app/games/:id",
        view: (params: Switch.Params) => html`
            <game-view game-id=${params.id}></game-view>
        `
    },
    {
        path: "/app",
        view: () => html`<home-view></home-view>`
    },
    {
        path: "/",
        redirect: "/app"
    }
];

class AppSwitch extends Switch.Element {
    constructor() {
        super(routes, "bgx:history", "bgx:auth");
    }
}

class AppStore extends Store.Provider<Model, Msg> {
    constructor() {
        super(update, init, "bgx:auth");
    }
}

define({
    "mu-auth": Auth.Provider,
    "mu-history": History.Provider,
    "mu-switch": AppSwitch,
    "mu-store": AppStore,
    "mu-form": Form.Element,
    "bgx-header": BgxHeader,
    "home-view": HomeViewElement,
    "game-view": GameViewElement,
    "game-edit": GameEditElement,
    "bgx-dashboard": BgxDashboard,
    "bgx-card": BgxCard
});