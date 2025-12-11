import { Card, Game } from "server/models"; // Import Game

export type Msg =
    | ["cards/load", { cards: Card[] }]
    | ["cards/request", {}]
    | ["game/load", { game: Game }]
    | ["game/request", { gameId: string }]
    ;