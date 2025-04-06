import { Request, Router, Response } from "express";
import {
  preventLoginSignup,
  registerUser,
} from "../controllers/auth.controller";
import { Tokens } from "../types_interfaces/types";

import jwt from "jsonwebtoken";
import passport from "../authentication/strategy/localStrategy";
import { configs } from "../config";

export const authRoute: Router = Router();

authRoute.post("/register", registerUser, (req: Request, res: Response) => {});

authRoute.post(
  "/login",
  preventLoginSignup,
  passport.authenticate("local"),
  (req: any, res: Response) => {
    const tokens: Tokens = {
      token: "",
    };

    const { rememberMe } = req.body;

    const checkRememberMe = rememberMe || req.body.rememberMe; // check if rememberMe is in the request body (double validation ) 😉

    const token = jwt.sign(
      {
        id: req.user.id.toString(),
        fullName: `${req.user.firstName} ${req.user.lastName}`,
        email: req.user.email,
      },
      configs.jwtSecret as string,
      { expiresIn: checkRememberMe ? "30d" : "1d" }
    );
    tokens.token = token;
    res.status(200).json({ token });
  }
);
