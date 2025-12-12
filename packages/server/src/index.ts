import express, { Request, Response } from "express";
import { connect } from "./services/mongo";
import cardsRouter from "./routes/cards";
import gamesRouter from "./routes/games";
import auth, { authenticateUser } from "./routes/auth";
import fs from "node:fs/promises";
import path from "path";

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

connect("Cluster0");

app.use(express.static(staticDir));
app.use(express.json());

app.use((req, _res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Mount routes
app.use("/api/cards", authenticateUser, cardsRouter);
app.use("/api/games", authenticateUser, gamesRouter);
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

app.get("/login.html", (req: Request, res: Response) => {
    const loginHtml = path.resolve(staticDir, "login.html");
    fs.readFile(loginHtml, { encoding: "utf8" })
        .then((html) => res.send(html))
        .catch(() => res.status(404).send("Login page not found"));
});


app.get("/register.html", (req: Request, res: Response) => {
    const registerHtml = path.resolve(staticDir, "register.html");
    fs.readFile(registerHtml, { encoding: "utf8" })
        .then((html) => res.send(html))
        .catch(() => res.status(404).send("Register page not found"));
});

// Serve index.html for all /app/* routes (SPA routing)
app.use("/app", (req: Request, res: Response) => {
    const indexHtml = path.resolve(staticDir, "index.html");
    fs.readFile(indexHtml, { encoding: "utf8" }).then((html) =>
        res.send(html)
    );
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log("Registered routes:");
    console.log("  /api/cards");
    console.log("  /api/games");
    console.log("  /auth");
    console.log("  /login.html");
    console.log("  /register.html");
});