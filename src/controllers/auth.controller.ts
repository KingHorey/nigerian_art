import { hash } from "bcrypt";
import { Request, Response, NextFunction } from "express";
import { UserModel } from "../schema/schema";
import { configs } from "../config";

import jwt from "jsonwebtoken";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, firstName, lastName, password } = req.body;

  try {
    let user = new UserModel({
      email,
      firstName,
      lastName,
    });
    if (user) {
      password &&
        hash(password, 10, async (err: any, hash: string) => {
          if (err) {
            return res.status(500).json({
              message: "Error hashing password",
              error: err,
            });
          }
          user.password = hash;
          await user.save();
          res.status(201).json({
            message: "Registration Successful",
          });
        });
    } else {
      res.status(400).json("User not created");
    }
  } catch (err) {
    res.status(500).json({
      message: "Error creating user",
      error: err,
    });
  }
};

export const findUserByEmail = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    let user = await UserModel.findOne({ email });
    if (user) {
      res.status(200).json({
        available: false,
        data: user,
      });
    } else {
      res.status(200).json({
        available: true,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Error finding user",
      error: err,
    });
  }
};

export function preventLoginSignup(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(req);
  if (req.isAuthenticated()) {
    res.status(400).json({ message: "You are already logged in" });
  } else {
    next();
  }
}

export async function checkPermission(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers["authorization"];
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
  } else {
    await verifyToken(token);
    next();
  }
}

async function verifyToken(token: string) {
  jwt.verify(token, configs.jwtSecret as string, (err: any, decoded: any) => {
    if (err) {
      console.log("Token verification error:", err);
      return false;
    } else {
      return true;
    }
  });
}
