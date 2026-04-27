import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { authenticate } from "./middleware/auth.js";
import type { AuthRequest } from "./middleware/auth.js";

// Import routes
import userRoutes from "./routes/users.js";
import examRoutes from "./routes/exams.js";
import submissionRoutes from "./routes/submissions.js";
import proctoringRoutes from "./routes/proctoring.js";
import dashboardRoutes from "./routes/dashboard.js";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

// Parse CORS origins from environment
const corsOrigins = ["http://localhost:8080", "http://localhost:5173", "http://localhost:3000"];

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
  })
);

// Export for use in routes
export { prisma, authenticate };
export type { AuthRequest };

// Routes
app.use("/api/auth", userRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/proctoring", proctoringRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ message: "Server is running", timestamp: new Date() });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

// Start server
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    console.log("✅ Database connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
