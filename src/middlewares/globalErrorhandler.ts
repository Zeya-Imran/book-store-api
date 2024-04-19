import { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";
import { config } from "../config/config";
import exp from "constants";

// thorw it from the active routes like get
// const error = createHttpError(400, "something")
// throw error

const globalErrorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message,
    //errorStack: config.env === "development" ? err.stack : "",
    errorStack: err.stack,
  });
};
export default globalErrorHandler;
