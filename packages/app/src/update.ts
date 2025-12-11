import { Auth } from "@calpoly/mustang";
import { Msg } from "./messages";
import { Model } from "./model";
import { Card, Game } from "server/models";

export default function update(
    message: Msg,
    model: Model,
    user: Auth.User
) {
    const [command, payload, callbacks] = message;

    switch (command) {
        case "cards/request":
            return [
                model,
                fetchCards(user)
            ] as [Model, Promise<Msg>];

        case "cards/load":
            const { cards } = payload;
            return { ...model, dashboard: cards };

        case "game/request":
            const { gameId } = payload;
            return [
                model,
                fetchGame(gameId, user)
            ] as [Model, Promise<Msg>];

        case "game/load":
            return { ...model, game: payload.game };

        case "game/save": {
            const { onSuccess, onFailure } = callbacks || {};
            return [
                model,
                saveGame(payload, user)
                    .then((game) => {
                        if (onSuccess) onSuccess();
                        return ["game/load", { game }] as Msg;
                    })
                    .catch((error: Error) => {
                        if (onFailure) onFailure(error);
                        throw error;
                    })
            ] as [Model, Promise<Msg>];
        }

        default:
            const unhandled: never = command;
            throw new Error(`Unhandled message "${unhandled}"`);
    }
}

function fetchCards(user: Auth.User): Promise<Msg> {
    return fetch("/api/cards", {
        headers: Auth.headers(user)
    })
        .then((response: Response) => {
            if (response.status === 200) return response.json();
            throw new Error(`Server error: ${response.status}`);
        })
        .then((json: unknown) => {
            if (json) return ["cards/load", { cards: json as Card[] }] as Msg;
            throw new Error("Parse error");
        })
        .catch((err) => {
            console.error("Fetch failed:", err);
            throw err;
        });
}

function fetchGame(gameId: string, user: Auth.User): Promise<Msg> {
    return fetch(`/api/games/${gameId}`, {
        headers: Auth.headers(user)
    })
        .then((response: Response) => {
            if (response.status === 200) return response.json();
            throw new Error(`Failed to fetch game: ${response.status}`);
        })
        .then((json: unknown) => {
            if (json) return ["game/load", { game: json as Game }] as Msg;
            throw new Error("No JSON in response from server");
        });
}

function saveGame(
    msg: { gameId: string; game: Game },
    user: Auth.User
): Promise<Game> {
    return fetch(`/api/games/${msg.gameId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...Auth.headers(user)
        },
        body: JSON.stringify(msg.game)
    })
        .then((response: Response) => {
            if (response.status === 200) return response.json();
            throw new Error(`Failed to save game for ${msg.gameId}`);
        })
        .then((json: unknown) => {
            if (json) return json as Game;
            throw new Error("No JSON in API response");
        });
}