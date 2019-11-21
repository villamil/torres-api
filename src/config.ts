export const CONFIG = {
  PORT: process.env.PORT || 3001,
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_PORT: Number(process.env.DB_PORT) || 3306,
  DB_PASSWORD: process.env.DB_PASSWORD || "pwd123",
  DB_USER: process.env.DB_USER || "root",
  DB_NAME: process.env.DB_NAME || "test",
  DB_SYNC: Boolean(process.env.DB_SYNC) || true,

  JWT_EXPIRATION: process.env.JWT_EXPIRATION || "3h",
  JWT_ISS: process.env.JWT_ISS || "Torres",
  JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY || "",
  JWT_PUBLIC_KEY: process.env.JWT_PUBLIC_KEY || "",
  JWT_AUDIENCE: process.env.JWT_AUDIENCE || "http://localhost"
};
