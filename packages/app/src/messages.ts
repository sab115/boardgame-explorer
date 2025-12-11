import { Card, Game } from "server/models";

export type Msg =
    | ["cards/load", { cards: Card[] }]
    | ["cards/request", {}]
    | ["game/load", { game: Game }]
    | ["game/request", { gameId: string }]
    | ["game/save", {
    gameId: string;
    game: Game;
}, {
    onSuccess?: () => void;
    onFailure?: (err: Error) => void;
}];