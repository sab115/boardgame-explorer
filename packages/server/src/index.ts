import express, { Request, Response } from "express";
import { connect } from "./services/mongo";
import Cards from "./services/card-svc";

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

connect("Cluster0");

app.use(express.static(staticDir));

app.get("/hello", (_req: Request, res: Response) => {
    res.send("Hello, World");
});

app.get("/api/health", (_req, res) => {
    res.json({
        status: "ok",
        message: "Server is running",
    });
});

app.get("/api/cards", (req, res) => {
    Cards.index().then((cards) => res.json(cards));
});

app.get("/api/cards/:id", (req, res) => {
    Cards.get(req.params.id).then((card) => {
        if (card) res.json(card);
        else res.status(404).send();
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
