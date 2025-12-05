// packages/proto/vite.config.js
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                // main home page
                main: resolve(__dirname, "index.html"),
                // login page
                login: resolve(__dirname, "login.html"),
            },
        },
    },
});
