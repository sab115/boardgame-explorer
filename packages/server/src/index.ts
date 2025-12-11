import express, { Request, Response } from "express";
import { connect } from "./services/mongo";
import Cards from "./services/card-svc";
import cardsRouter from "./routes/cards";
import auth, { authenticateUser } from "./routes/auth";
import fs from "node:fs/promises";
import path from "path";

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

connect("Cluster0");

app.use(express.static(staticDir));
app.use(express.json());

app.use("/api/cards", authenticateUser, cardsRouter);
app.use("/auth", auth);

app.get("/hello", (_req: Request, res: Response) => {
    res.send("Hello, World");
});

app.get("/api/health", (_req, res) => {
    res.json({
        status: "ok",
        message: "Server is running",
    });
});

app.use("/app", (req: Request, res: Response) => {
    const indexHtml = path.resolve(staticDir, "index.html");
    fs.readFile(indexHtml, { encoding: "utf8" }).then((html) =>
        res.send(html)
    );
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
