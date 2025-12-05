import express, { Request, Response } from "express";
import Cards from "../services/card-svc";
import { Card } from "../models/card";

const router = express.Router();

// GET /api/cards (collection)
router.get("/", (_req: Request, res: Response) => {
    Cards.index()
        .then((list: Card[]) => res.json(list))
        .catch((err) => res.status(500).send(err));
});

// GET /api/cards/:id (single resource)
router.get("/:id", (req: Request, res: Response) => {
    const { id } = req.params;

    Cards.get(id)
        .then((card) => {
            if (card) res.json(card);
            else res.status(404).end();
        })
        .catch((err) => res.status(500).send(err));
});

// POST /api/cards  (create)
router.post("/", (req: Request, res: Response) => {
    const newCard = req.body as Card;

    Cards.create(newCard)
        .then((card) => res.status(201).json(card))
        .catch((err) => res.status(500).send(err));
});

// PUT /api/cards/:id  (update)
router.put("/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    const updates = req.body as Partial<Card>;

    Cards.update(id, updates)
        .then((card) => {
            if (card) res.json(card);
            else res.status(404).end();
        })
        .catch((err) => res.status(500).send(err));
});

// DELETE /api/cards/:id  (remove)
router.delete("/:id", (req: Request, res: Response) => {
    const { id } = req.params;

    Cards.remove(id)
        .then(() => res.status(204).end())
        .catch((err) => res.status(404).send(err));
});

export default router;
