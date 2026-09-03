import express from "express";
import { askContract } from "../controllers/ai.controller.js";
import { analyzeContractById } from "../controllers/analysis.controller.js";
import {
  createContract,
  getContracts,
  getContract,
  deleteContract,
  uploadContract,
} from "../controllers/contract.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const contractRoutes = express.Router();

contractRoutes.use(protect);

contractRoutes.post("/", createContract);

contractRoutes.post("/upload", upload.single("file"), uploadContract);

contractRoutes.get("/", getContracts);

contractRoutes.get("/:id", getContract);

contractRoutes.delete("/:id", deleteContract);

contractRoutes.post("/:id/ask", askContract);

contractRoutes.post("/:id/analyze", analyzeContractById);
export default contractRoutes;
