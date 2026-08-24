
import 'dotenv/config';
import express from "express";
import startApp from './src/app.js';
import connectDatabase from './src/config/database.connect.js';
import { DBNotConnect } from './src/errors/database.error.js';
const app = express()

await startApp(app);
const database_response = await connectDatabase();

if(!database_response.success){
    throw new DBNotConnect();
}

app.get('/', (req, res)=> {
    res.send('server is running')
});

// Global Error Handler 
app.use((err, req, res, next)=>{
    res.status(500).json({
        success: false,
        message: err.message
    });
});