
import mongoose from "mongoose"
import { URINotFound } from "../errors/database.error.js";

const URI = process.env.CONNECTION_STRING;

export default function connectDatabase(){
    if(!URI){
        throw new URINotFound();
    }

    try{
        mongoose.connect(URI);
        return {
            success: true,
            message: "Database is connected"
        }
    }catch(err){
        return {
            success: false,
            message: err.message
        }
    }
}