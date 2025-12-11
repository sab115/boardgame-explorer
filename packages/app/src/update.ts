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
    switch (message[0]) {
        case "cards/request":
            return [
                model,
                fetchCards(user)
            ] as [Model, Promise<Msg>];

        case "cards/load":
            const { cards } = message[1];
            return { ...model, dashboard: cards };

        case "game/request":
            const { gameId } = message[1];
            console.log("Handling game/request for:", gameId);
            return [
                model,
                fetchGame(gameId, user)
            ] as [Model, Promise<Msg>];

        case "game/load":
            console.log("Handling game/load (Data arrived!)");
            return { ...model, game: message[1].game };

        default:
            const unhandled = message[0];
            throw new Error(`Unhandled Auth message "${unhandled}"`);
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

// Replace the real fetch with this Mock Data version
function fetchGame(gameId: string, user: Auth.User): Promise<Msg> {
    return new Promise((resolve) => {
        // Simulate a 0.5 second network delay
        setTimeout(() => {
            resolve(["game/load", {
                game: {
                    _id: gameId,
                    title: `Game: ${gameId}`, // Dynamic title based on URL
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