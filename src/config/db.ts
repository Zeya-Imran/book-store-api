import mongoose from "mongoose";
import { config } from "./config";
import exp from "constants";

const connectDb = async () => {
    try {
        

        //after connected
        mongoose.connection.on("connected", () => {
            console.log("connected to the database sucessfully");
        });

        // error occured on running server
        mongoose.connection.on("error", (err)=> {
            console.log("Error in connecting to database", err);
        })


        await mongoose.connect(config.databaseUrl as string);

    } catch (error) {
        console.error("Failed to connect to database.",error);
        process.exit(1);
    }
}


export default connectDb;