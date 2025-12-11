export interface Game {
    _id: string;
    title: string;
    players: string;
    playTime: string;
    category: string;
    mechanic: string;
    designer: string;
    publisher: string;
    expansions?: string[];
}