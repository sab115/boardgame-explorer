import {Card, Game} from "server/models";

export type Msg =
    | ["cards/request", {}]
    | ["game/request", { gameId: string }]
    | ["game/save", {
    gameId: string;
    game: Game;
}, {
    onSuccess?: () => void;
    onFailure?: (err: Error) => void;
}]
    | Cmd;

type Cmd =
    | ["cards/load", { cards: Card[] }]
    | ["game/load", { game: Game }];