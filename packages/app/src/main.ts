import { Auth, define, History, Switch, Store, Form } from "@calpoly/mustang";
import { html } from "lit";
import { BgxHeader } from "./components/bgx-header";
import { HomeViewElement } from "./views/home-view";
import { GameViewElement } from "./views/game-view";
import { GameEditElement } from "./views/game-edit";
import { GamesViewElement } from "./views/games-view";
import { CategoriesViewElement } from "./views/categories-view";
import { MechanicsViewElement } from "./views/mechanics-view";
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
        path: "/app/games",
        view: () => html`<games-view></games-view>`
    },
    {
        path: "/app/categories",
        view: () => html`<categories-view></categories-view>`
    },
    {
        path: "/app/mechanics",
        view: () => html`<mechanics-view></mechanics-view>`
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
    "games-view": GamesViewElement,
    "categories-view": CategoriesViewElement,
    "mechanics-view": MechanicsViewElement,
    "bgx-dashboard": BgxDashboard,
    "bgx-card": BgxCard
});