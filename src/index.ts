import express, { Request, Response, Express } from "express";
import cors from "cors";
import cookie from "cookie-parser";
import { configs } from "./config";
import { mongo } from "./connections/mongoConnection";
import { authRoute } from "./routes/auth.routes";
// @ts-ignore
import session from "express-session";
const MemoryStore = require("memorystore")(session);

import passport from "./authentication/strategy/localStrategy";
import { categoriesRoute } from "./routes/categories.route";
import { artistRoute } from "./routes/artist.route";

const app: Express = express();
mongo;

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for parsing application/x www-form-urlencoded
app.use(cookie()); // for parsing cookies
app.use(
  cors({
    origin: configs.url,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(
  session({
    secret: configs.sessionSecret,
    resave: false, // for resaving session if unmodified
    saveUninitialized: false, // for saving uninitialized session
    store: new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    }), // for storing session in memory
    cookie: {
      secure: configs.mode, // set to true if using https
      maxAge: 1000 * 60 * 60 * 24, // for setting cookie expiration time
    },
  })
);
app.use(passport.initialize()); // for initializing passport
app.use(passport.session()); // for session management

app.use("/api/auth", authRoute);
app.use("/api/categories", categoriesRoute); // for authentication routes
app.use("/api/artists", artistRoute);

app.listen(configs.port, () => {
  console.log(`Server is running on port ${configs.port}`);
});

app.get(["/", "home"], (req: Request, res: Response) => {
  res.json("Welcome to african arts museum");
});
