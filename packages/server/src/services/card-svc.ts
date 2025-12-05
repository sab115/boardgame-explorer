import { Schema, model } from "mongoose";
import { Card } from "../models/card";

const CardSchema = new Schema<Card>(
    {
        _id: { type: String, required: true, unique: true, trim: true },
        title: { type: String, required: true },
        icon: { type: String, required: true },
        href: { type: String, required: true },
        linkLabel: { type: String, required: true },
        span: { type: Number, required: true }
    },
    { collection: "bgx_cards" }
);

const CardModel = model<Card>("Card", CardSchema);

function index(): Promise<Card[]> {
    return CardModel.find().lean();
}

function get(id: string): Promise<Card | null> {
    return CardModel.findById(id).lean();
}


// POST: create a new card
function create(json: Card): Promise<Card> {
    const card = new CardModel(json);
    return card.save() as Promise<Card>;
}

// PUT: update an existing card, return the new version
function update(id: string, json: Partial<Card>): Promise<Card | null> {
    return CardModel.findByIdAndUpdate(id, json, {
        new: true
    }).lean();
}

// DELETE: remove a card
function remove(id: string): Promise<void> {
    return CardModel.findByIdAndDelete(id).then((deleted) => {
        if (!deleted) throw `${id} not deleted`;
    });
}

export default { index, get, create, update, remove };