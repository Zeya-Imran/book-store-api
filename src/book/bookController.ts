import { NextFunction, Request, Response } from "express";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body);

  res.json({ messag: "something" });
};

export { createBook };
