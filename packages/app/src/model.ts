import { Card, Game } from "server/models";
export interface Model {
    dashboard?: Card[];
    game?: Game;
}

export const init: Model = {};