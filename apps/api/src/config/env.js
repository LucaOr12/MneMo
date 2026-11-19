function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export const config = Object.freeze({
  port: Number(process.env.PORT ?? 3001),
  databaseUrl: required("DATABASE_URL"),
  dbPoolMax: Number(process.env.DB_POOL_MAX ?? 5),
});
