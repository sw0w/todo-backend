import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export interface AuthReq extends Request {
  user?: { userId: string; username: string };
}

const authMW = (req: AuthReq, res: Response, next: NextFunction) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Token ")) {
    res.status(401).json({ message: "No permission" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
      username: string;
    };

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token not valid" });
    return;
  }
};

export default authMW;
