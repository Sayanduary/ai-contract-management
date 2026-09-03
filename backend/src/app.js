import express from "express";
import cors from "cors";
import authRoute from "./routes/auth.route.js";
import contractRoutes from "./routes/contract.routes.js";
import reminderRoutes from "./routes/reminder.routes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    Credential: true,
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
