import express from "express";
import cors from "cors";
import authRoute from "./routes/auth.route.js";
import contractRoutes from "./routes/contract.routes.js";
import reminderRoutes from "./routes/reminder.routes.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. curl, Postman, mobile apps)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AI Contract Management API is running",
  });
});

app.use("/api/auth", authRoute);
app.use("/api/contracts", contractRoutes);
app.use("/api/reminders", reminderRoutes);

export default app;
