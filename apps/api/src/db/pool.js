import pg from "pg";
import { config } from "../config/env.js";

export const pool = new pg.Pool({
  connectionString: config.databaseUrl,
  max: config.dbPoolMax,
  idleTimeoutMillis: 10_000, //closes connection after 10 seconds of inactivity
  connecttionTimeoutMillis: 5_000, //gives up after 5 seconds of trying to connect
});

pool.on("error", (err) => {
  console.error("Database pool error:", err);
});

export const query = (text, params) => pool.query(text, params);
