import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
const createUser = async (req: Request,res: Response ,next:  NextFunction) => {
    const {name, email, password} = req.body;


    //validation 
    if(!name || !email || !password){
        const error = createHttpError(400, "all field are required");
        return next(error);
    }

    //database call
    const user = await userModel.findOne({email});
    if(user){
        const error = createHttpError(400,"user already exits, try with another email id");
        return next(error);
    }
    

    //password hashing
    const passwordHasing = await bcrypt.hash(password,10);

    //process
    // try {
        var newUser = await userModel.create({
            name,
            email,
            password: passwordHasing
        });
    // } 
    // catch (error) {
    //     createHttpError(400,"user already exits, try with another email id");
    // }

    //Token generation with JWT
    const accessToken = sign({sub:newUser._id},
        config.jwtSecret as string, 
        {
            expiresIn:'7d',
            algorithm: "HS256"
        });

    res.json({"accessToken":accessToken});
    //response

}

export { createUser}