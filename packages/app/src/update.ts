import { Auth } from "@calpoly/mustang";
import { Msg } from "./messages";
import { Model } from "./model";
import { Card, Game } from "server/models";

export default function update(
    message: Msg,
    model: Model,
    user: Auth.User
) {
    console.log("UPDATE received message:", message[0]);
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
            console.log("Handling game/request for:", gameId);
            return [
                model,
                fetchGame(gameId, user)
            ] as [Model, Promise<Msg>];

        case "game/load":
            console.log("Handling game/load (Data arrived!)");
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
            throw `Server error: ${response.status}`;
        })
        .then((json: unknown) => {
            if (json) return ["cards/load", { cards: json as Card[] }] as Msg;
            throw new Error("Parse error");
        })
        .catch((err) => {
            console.log("Fetch failed:", err);
            throw err;
        });
}

function fetchGame(gameId: string, user: Auth.User): Promise<Msg> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(["game/load", {
                game: {
                    _id: gameId,
                    title: `Game: ${gameId}`,
                    players: "2-4",
                    playTime: "30-60 min",
                    category: "Family Strategy",
                    mechanic: "Route Building",
                    designer: "Alan R. Moon",
                    publisher: "Days of Wonder",
                    expansions: []
                }
            }] as Msg);
        }, 500);
    });
}

function saveGame(
    msg: { gameId: string; game: Game },
    user: Auth.User
): Promise<Game> {
    console.log("Saving game:", msg.game);

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(msg.game);
        }, 500);
    });

    /*
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
    */
}