import { Schema, model } from "mongoose";
import { Card } from "../models/card";

const CardSchema = new Schema<Card>(
    {
        id: { type: String, required: true, unique: true, trim: true },
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
    return CardModel.find();
}

function get(id: string): Promise<Card | null> {
    return CardModel.findOne({ id });
}

export default { index, get };
