import { config } from "dotenv";

config();

export const configs = Object.freeze({
  url: process.env.URL || "http://localhost:3000",
  port: process.env.PORT || 3000,
  mongoUrl: process.env.MONGO_URL || "mongodb://localhost:27017",
  sessionSecret: process.env.SESSION_SECRET_KEY as string,
  dbName: process.env.DB_NAME || "african-arts-museum",
  dbPassword: process.env.DB_PASSWORD,
  jwtSecret: process.env.JWT_SECRET,
  mode: process.env.MODE === "production" ? true : false,
});
