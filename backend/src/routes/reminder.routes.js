import express from "express";

import { protect } from "../middlewares/auth.middleware.js";

import {
  createReminder,
  getReminders,
  deleteReminder,
} from "../controllers/reminder.controller.js";

const reminderRoutes = express.Router();

// All reminder routes require authentication
reminderRoutes.use(protect);

// Create reminder for a contract
reminderRoutes.post("/contracts/:id/reminders", createReminder);

// Get current user's reminders
reminderRoutes.get("/", getReminders);

// Delete reminder
reminderRoutes.delete("/:id", deleteReminder);

export default reminderRoutes;
