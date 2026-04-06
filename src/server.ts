import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import employeeRoutes from "./routes/employees";
import salaryCalculationRoutes from "./routes/salary";
import salaryMetricsRoutes from "./routes/salaryMetrics";
import { errorHandler, requestLogger } from "./middleware/errorHandler";

dotenv.config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Routes
app.use("/employees", employeeRoutes);
app.use("/employees", salaryCalculationRoutes);
app.use("/salary-metrics", salaryMetricsRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
