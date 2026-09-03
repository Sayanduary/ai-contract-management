import prisma from "./src/config/db.js";

try {
  await prisma.$connect();
  console.log("Database connected successfully");
} catch (error) {
  console.error("Database connection failed:", error);
} finally {
  await prisma.$disconnect();
}
