import prisma from "../config/db.js";
import { contractRagGraph } from "../ai/llm-contract-rag.js";

export const askContract = async (req, res) => {
  try {
    const { id } = req.params;
    const { question } = req.body;

    // Validate question
    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    // Verify contract belongs to authenticated user
    const contract = await prisma.contract.findFirst({
      where: {
        id,
        userId: req.userId,
      },
      select: {
        id: true,
        title: true,
      },
    });

    if (!contract) {
      return res.status(404).json({
        success: false,
        message: "Contract not found",
      });
    }

    console.log(`Question for contract: ${contract.title}`);
    console.log(`Question: ${question}`);

    // Run LangGraph
    const result = await contractRagGraph.invoke({
      question: question.trim(),
      contractId: contract.id,
    });

    return res.status(200).json({
      success: true,
      contract: {
        id: contract.id,
        title: contract.title,
      },
      question: question.trim(),
      answer: result.answer,
      sources: result.chunks.map((chunk) => ({
        chunkIndex: chunk.chunkIndex,
        similarity: Number(chunk.similarity),
        content: chunk.content,
      })),
    });
  } catch (error) {
    console.error("Contract Q&A error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to answer contract question",
      error: error.message,
    });
  }
};
