
import 'dotenv/config';
import express from "express";
import startApp from './src/app.js';
import routes from './src/routes/index.js';
import multer from 'multer';
import prisma from "./src/config/prisma.js";
const app = express()
const upload = multer();

await startApp(app);


app.use(express.json());
app.use(upload.array());
app.use(upload.single('avatar'));

app.get('/', (req, res)=> {
    res.send('server is running')
});

app.use(routes);

// Global Error Handler 
app.use((err, req, res, next)=>{
    res.status(500).json({
        success: false,
        message: `${err.name} -> ${err.message}`
    });
});

const shutdown = async () => {
    console.log("Shutting down server...");

    await prisma.$disconnect();

    server.close(() => {
        console.log("Server closed.");
        process.exit(0);
    });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);