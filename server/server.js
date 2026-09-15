// plugins
import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// configurations
import startApp from "./src/app.js";
import prisma from "./src/config/prisma.js";

// server routes
import routes from "./src/routes/index.js";

// instances of plugins
const app = express();

// application server
startApp(app);

// middleware (application level)
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],

  }),
);
app.use(cookieParser());
app.use(express.json());

// status routes
app.get("/", (req, res) => {
  const rawUA = req.get('user-agent');
  res.send("server is running");
});

// service routes
app.use(routes);

app.use((req, res) => {
  res.status(404).send("the requested route does not exist");
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
