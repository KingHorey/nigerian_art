import { Router, Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { hash } from "bcrypt";

import { UserModel } from "../schema/schema";
import { preventLoginSignup } from "../controllers/auth.controller";
import passport from "./strategy/localStrategy";

import { Tokens } from "../types_interfaces/types";
import { configs } from "../config";

// const authRoute: Router = Router();

// registration route
// authRoute.post(
//   "/register",
//   (req: Request, res: Response, Next: NextFunction) => {
//     const { email, firstName, lastName, password } = req.body;
//     console.log(email);
//     try {
//       let user = new UserModel({
//         email,
//         firstName,
//         lastName,
//       });
//       if (user) {
//         password &&
//           hash(password, 10, (err: any, hash: string) => {
//             if (err) {
//               return res.status(500).json({
//                 message: "Error hashing password",
//                 error: err,
//               });
//             }
//             user.password = hash;
//             user.save();
//           });
//       } else {
//         res.json("User not created");
//       }
//     } catch (err) {
//       res.status(500).json({
//         message: "Error creating user",
//         error: err,
//       });
//     }
//   }
// );

// login route
