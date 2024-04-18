import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import { User } from "./userTypes";

//register
const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  //validation
  if (!name || !email || !password) {
    const error = createHttpError(400, "all field are required");
    return next(error);
  }

  //database call -checking user already exits or not
  try {
    const user = await userModel.findOne({ email });
    if (user) {
      return next(
        createHttpError(400, "user already exits, try with another email id")
      );
    }
  } catch (error) {
    return next(createHttpError(500, "Internal server Error"));
  }

  //form data process and save into db
  let newUser: User;
  try {
    //password hashing
    const passwordHasing = await bcrypt.hash(password, 10);
    newUser = await userModel.create({
      name,
      email,
      password: passwordHasing,
    });
    //Token generation with JWT
    const accessToken = sign({ sub: newUser._id }, config.jwtSecret as string, {
      expiresIn: "7d",
      algorithm: "HS256",
    });
    res.status(201).json({ accessToken: accessToken });
  } catch (error) {
    next(createHttpError(500, "Error while creating user"));
  }
};

//login user
const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(createHttpError(404, "all field required"));

  try {
    const user = await userModel.findOne({ email });
    if (!user) return next(createHttpError(404, "User not Found"));

    const isMatch = await bcrypt.compare(password, user.password as string);
    if (!isMatch)
      return next(createHttpError(400, "Username or Password incorrect"));

    const accessToken = sign({ sub: user._id }, config.jwtSecret as string, {
      expiresIn: "7d",
      algorithm: "HS256",
    });

    res.status(200).json({ accessToken: accessToken });
  } catch (error) {
    return next(createHttpError(500, "Error Login while login"));
  }
};

export { createUser, loginUser };
