import express, { Request, Response } from "express";
import Games from "../services/games-svc";
import { Game } from "../models";

const router = express.Router();
console.log("Games router loaded");
// GET /api/games (collection)
router.get("/", (_req: Request, res: Response) => {
    console.log("GET /api/games called");
    Games.index()
        .then((list: Game[]) => {
            console.log("Games found:", list.length);
            res.json(list);
        })
        .catch((err) => {
            console.error("Error fetching games:", err);
            res.status(500).send(err);
        });
});

// GET /api/games/:id (single resource)
router.get("/:id", (req: Request, res: Response) => {
    const { id } = req.params;

    Games.get(id)
        .then((game) => {
            if (game) res.json(game);
            else res.status(404).end();
        })
        .catch((err) => res.status(500).send(err));
});

// POST /api/games (create)
router.post("/", (req: Request, res: Response) => {
    const newGame = req.body as Game;

    Games.create(newGame)
        .then((game) => res.status(201).json(game))
        .catch((err) => res.status(500).send(err));
});

// PUT /api/games/:id (update)
router.put("/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    const updates = req.body as Partial<Game>;

    Games.update(id, updates)
        .then((game) => {
            if (game) res.json(game);
            else res.status(404).end();
        })
        .catch((err) => res.status(500).send(err));
});

// DELETE /api/games/:id (remove)
router.delete("/:id", (req: Request, res: Response) => {
    const { id } = req.params;

    Games.remove(id)
        .then(() => res.status(204).end())
        .catch((err) => res.status(404).send(err));
});

export default router;