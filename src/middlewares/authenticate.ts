import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { verify } from "jsonwebtoken";
import { config } from "../config/config";

export interface AuthReques extends Request {
  userId: string;
}

//midddleware for extrcting the userId from token
const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization");
  if (!token)
    return next(createHttpError(401, "Authorization token is required"));

  try {
    const parsedToken = token.split(" ")[1];
    const decoded = verify(parsedToken, config.jwtSecret as string);

    const _req = req as AuthReques; //implementing types of typescripte rule
    _req.userId = decoded.sub as string;
    next();
  } catch (error) {
    next(createHttpError(401, "Token expired."));
  }
};

export default authenticate;
