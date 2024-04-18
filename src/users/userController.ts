import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt";
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
        next(error);
    }


    //password hashing
    const passwordHasing = bcrypt.hash(password,10);
    req.body.password = passwordHasing;




    //process

    //response
    res.json({message:"from userController"})
}

export { createUser}