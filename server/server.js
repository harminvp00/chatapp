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

// instances for server/websockets
const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173"
    ],
    methods: ['GET', 'POST'],
    credentials: true,
  })
);

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173"
    ],
    methods: ['GET', 'POST'],
    credentials: true,
  }
});

// application server
startApp(server);

io.on("connection", (socket) => {
  console.log('User connected:::', socket.id);

  socket.on('welcome', (msg) => {
    console.log(msg)
  })
});

// other middlewares 
app.use(cookieParser());
app.use(express.json());
app.use(limiter);

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
