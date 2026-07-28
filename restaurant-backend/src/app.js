import express from "express";
import cors from "cors";
import helmet from "helmet";
import "dotenv/config";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/error-handler.js";
import logger from "./utils/logger.js";

const app = express();

// Security & parsing middleware
app.use(helmet()); // sets security headers
app.use(cors()); // enable CORS
app.use(express.json()); // parse JSON bodies
app.use(express.urlencoded({ extended: true }));

// Request logging – log every incoming request
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Mount all API routes under /api/v1
app.use("/api/v1", routes);

// Health check endpoint (useful for container orchestration)
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Global error handler (must be last)
app.use(errorHandler);

export default app;
