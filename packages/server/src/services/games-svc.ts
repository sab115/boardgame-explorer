import { Schema, model } from "mongoose";
import { Game } from "../models/game";

const GameSchema = new Schema<Game>(
    {
        _id: { type: String, required: true, unique: true, trim: true },
        title: { type: String, required: true },
        players: { type: String, required: true },
        playTime: { type: String, required: true },
        category: { type: String, required: true },
        mechanic: { type: String, required: true },
        designer: { type: String, required: true },
        publisher: { type: String, required: true },
        expansions: { type: [String], default: [] }
    },
    { collection: "bgx_games" }
);

const GameModel = model<Game>("Game", GameSchema);

function index(): Promise<Game[]> {
    return GameModel.find().lean();
}

function get(id: string): Promise<Game | null> {
    return GameModel.findById(id).lean();
}

function create(json: Game): Promise<Game> {
    const game = new GameModel(json);
    return game.save() as Promise<Game>;
}

function update(id: string, json: Partial<Game>): Promise<Game | null> {
    return GameModel.findByIdAndUpdate(id, json, {
        new: true
    }).lean();
}

function remove(id: string): Promise<void> {
    return GameModel.findByIdAndDelete(id).then((deleted) => {
        if (!deleted) throw `${id} not deleted`;
    });
}

export default { index, get, create, update, remove };