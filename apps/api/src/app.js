import express from "express";
import healthRouter from "./routes/health.js";

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.use(express.json({ limit: "50kb" }));
  app.use("/api/health", healthRouter);

  app.use((_req, res) => {
    res.status(404).json({ error: "not_found" });
  });

  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: "internal_server_error" });
  });

  return app;
}
