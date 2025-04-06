import mongoose from "mongoose";
import { config } from "dotenv";
import { configs } from "../config";

config();

export const mongo = mongoose
  .connect(configs.mongoUrl, {
    dbName: configs.dbName,
    ssl: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err: any) => {
    console.log(err.message);
    // try to connect to local mongosh for development
  });
