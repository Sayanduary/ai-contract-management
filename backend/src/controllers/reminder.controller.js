import prisma from "../config/db.js";

// ==========================================
// CREATE REMINDER
// ==========================================

export const createReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const { reminderDate } = req.body;

    if (!reminderDate) {
      return res.status(400).json({
        success: false,
        message: "Reminder date is required",
      });
    }

    const date = new Date(reminderDate);

    if (Number.isNaN(date.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid reminder date",
      });
    }

    // ==========================================
    // CHECK CONTRACT OWNERSHIP
    // ==========================================

    const contract = await prisma.contract.findFirst({
      where: {
        id,
        userId: req.userId,
      },
      select: {
        id: true,
        title: true,
        expiryDate: true,
      },
    });

    if (!contract) {
      return res.status(404).json({
        success: false,
        message: "Contract not found",
      });
    }

    // ==========================================
    // CREATE REMINDER
    // ==========================================

    const reminder = await prisma.reminder.create({
      data: {
        contractId: contract.id,
        reminderDate: date,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Reminder created successfully",
      reminder,
    });
  } catch (error) {
    console.error("Create reminder error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create reminder",
      error: error.message,
    });
  }
};

// ==========================================
// GET USER REMINDERS
// ==========================================

export const getReminders = async (req, res) => {
  try {
    const reminders = await prisma.reminder.findMany({
      where: {
        contract: {
          userId: req.userId,
        },
      },
      include: {
        contract: {
          select: {
            id: true,
            title: true,
            expiryDate: true,
            status: true,
          },
        },
      },
      orderBy: {
        reminderDate: "asc",
      },
    });

    return res.status(200).json({
      success: true,
      count: reminders.length,
      reminders,
    });
  } catch (error) {
    console.error("Get reminders error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch reminders",
      error: error.message,
    });
  }
};

// ==========================================
// DELETE REMINDER
// ==========================================

export const deleteReminder = async (req, res) => {
  try {
    const { id } = req.params;

    // ==========================================
    // FIND REMINDER THROUGH CONTRACT OWNERSHIP
    // ==========================================

    const reminder = await prisma.reminder.findFirst({
      where: {
        id,
        contract: {
          userId: req.userId,
        },
      },
    });

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: "Reminder not found",
      });
    }

    // ==========================================
    // DELETE
    // ==========================================

    await prisma.reminder.delete({
      where: {
        id: reminder.id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Reminder deleted successfully",
    });
  } catch (error) {
    console.error("Delete reminder error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete reminder",
      error: error.message,
    });
  }
};
