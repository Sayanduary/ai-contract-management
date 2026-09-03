import prisma from "../config/db.js";
import { analyzeContract } from "../services/contract-analysis.service.js";

export const analyzeContractById = async (req, res) => {
  try {
    const { id } = req.params;

    // ==========================================
    // CHECK CONTRACT OWNERSHIP
    // ==========================================

    const contract = await prisma.contract.findFirst({
      where: {
        id,
        userId: req.userId,
      },
      include: {
        chunks: {
          orderBy: {
            chunkIndex: "asc",
          },
        },
      },
    });

    if (!contract) {
      return res.status(404).json({
        success: false,
        message: "Contract not found",
      });
    }

    // ==========================================
    // REBUILD CONTRACT TEXT
    // ==========================================

    const contractText = contract.chunks
      .map((chunk) => chunk.content)
      .join("\n\n");

    if (!contractText.trim()) {
      return res.status(400).json({
        success: false,
        message: "No contract text available for analysis",
      });
    }

    console.log(`Analyzing contract: ${contract.title}`);

    // ==========================================
    // AI ANALYSIS
    // ==========================================

    const result = await analyzeContract(contractText);

    console.log("AI analysis completed");

    // ==========================================
    // PARSE DATES
    // ==========================================

    const startDate = result.startDate ? new Date(result.startDate) : null;

    const expiryDate = result.expiryDate ? new Date(result.expiryDate) : null;

    // ==========================================
    // CALCULATE CONTRACT STATUS
    // ==========================================

    let status = "ACTIVE";

    if (expiryDate) {
      const now = new Date();

      if (expiryDate < now) {
        status = "EXPIRED";
      } else {
        const millisecondsPerDay = 1000 * 60 * 60 * 24;

        const daysUntilExpiry = (expiryDate - now) / millisecondsPerDay;

        if (daysUntilExpiry <= 30) {
          status = "EXPIRING";
        }
      }
    }

    // ==========================================
    // UPDATE CONTRACT
    // ==========================================

    const updatedContract = await prisma.contract.update({
      where: {
        id: contract.id,
      },
      data: {
        type: result.type || "Unknown",
        startDate,
        expiryDate,
        status,
      },
    });

    // ==========================================
    // SAVE ANALYSIS
    // ==========================================

    const analysis = await prisma.contractAnalysis.upsert({
      where: {
        contractId: contract.id,
      },
      update: {
        summary: result.summary,
        clauses: result.clauses,
        riskLevel: result.riskLevel,
        risks: result.risks,
      },
      create: {
        contractId: contract.id,
        summary: result.summary,
        clauses: result.clauses,
        riskLevel: result.riskLevel,
        risks: result.risks,
      },
    });

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,
      message: "Contract analyzed successfully",

      contract: {
        id: updatedContract.id,
        title: updatedContract.title,
        type: updatedContract.type,
        startDate: updatedContract.startDate,
        expiryDate: updatedContract.expiryDate,
        status: updatedContract.status,
      },

      analysis,
    });
  } catch (error) {
    console.error("Contract analysis error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to analyze contract",
      error: error.message,
    });
  }
};
