// plugins
import express from "express";
import { Server } from 'socket.io';
import { createServer } from "http";

import cors from "cors";
import cookieParser from "cookie-parser";

// configurations
import startApp from "./src/app.js";
import prisma from "./src/config/prisma.js";

// server routes
import routes from "./src/routes/index.js";
import { _env } from "./src/config/env.js";
import { limiter } from "./src/middlewares/rate.limit.js";
// instances of plugins
const app = express();
const server = createServer(app);
const io = new Server(server);

// application server
startApp(app);

io.on("connection", (socket) => {
  console.log('hello, User connected:::', socket.id);
  socket.emit('welcome', "welcome to the quickchat;s server room")
});

// middleware (application level)
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(limiter);

// app.use("/redirect", (req, res) => {
//   res
//     .status(302)
//     .cookie("name", "harmin")
//     .cookie("age", 21)
//     .redirect(_env.client_url + "/register");
// });

// status routes
app.get("/", (req, res) => {
  const rawUA = req.get("user-agent");
  res.send(rawUA);
});

// applications routes
app.use(routes);

app.use((req, res) => {
  res.status(404).sendFile('/home/harmin/Desktop/web3_projects/QuickChat/server/public/NotFound.html');
});

// Global Error Handler
app.use((err, req, res, next) => {
  res.status(500).json({
    success: false,
    message: `${err.name} -> ${err.message}`,
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
