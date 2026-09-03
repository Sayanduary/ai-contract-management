import prisma from "../config/db.js";

import { extractTextFromPdf } from "../services/pdf.service.js";
import { createChunks } from "../services/chunk.service.js";
import { generateEmbeddings } from "../services/embedding.service.js";
import { updateChunkEmbedding } from "../services/vector.service.js";

// ==========================================
// CREATE CONTRACT
// ==========================================

export const createContract = async (req, res) => {
  try {
    const { title, fileUrl, type, startDate, expiryDate } = req.body;

    if (!title || !fileUrl) {
      return res.status(400).json({
        success: false,
        message: "Title and fileUrl are required",
      });
    }

    const contract = await prisma.contract.create({
      data: {
        userId: req.userId,
        title,
        fileUrl,
        type: type || null,
        startDate: startDate ? new Date(startDate) : null,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Contract created successfully",
      contract,
    });
  } catch (error) {
    console.error("Create contract error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create contract",
    });
  }
};

// ==========================================
// GET ALL USER CONTRACTS
// ==========================================

export const getContracts = async (req, res) => {
  try {
    const contracts = await prisma.contract.findMany({
      where: {
        userId: req.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        analysis: true,
      },
    });

    return res.status(200).json({
      success: true,
      count: contracts.length,
      contracts,
    });
  } catch (error) {
    console.error("Get contracts error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch contracts",
    });
  }
};
// ==========================================
// GET SINGLE CONTRACT
// ==========================================

export const getContract = async (req, res) => {
  try {
    const { id } = req.params;

    const contract = await prisma.contract.findFirst({
      where: {
        id,
        userId: req.userId,
      },

      include: {
        analysis: true,

        chunks: {
          orderBy: {
            chunkIndex: "asc",
          },
        },

        reminders: true,
      },
    });

    if (!contract) {
      return res.status(404).json({
        success: false,
        message: "Contract not found",
      });
    }

    return res.status(200).json({
      success: true,
      contract,
    });
  } catch (error) {
    console.error("Get contract error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch contract",
    });
  }
};

// ==========================================
// DELETE CONTRACT
// ==========================================

export const deleteContract = async (req, res) => {
  try {
    const { id } = req.params;

    const contract = await prisma.contract.findFirst({
      where: {
        id,
        userId: req.userId,
      },
    });

    if (!contract) {
      return res.status(404).json({
        success: false,
        message: "Contract not found",
      });
    }

    await prisma.contract.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Contract deleted successfully",
    });
  } catch (error) {
    console.error("Delete contract error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete contract",
    });
  }
};

// ==========================================
// UPLOAD CONTRACT PDF
// ==========================================
// Flow:
//
// PDF
//  ↓
// Extract text
//  ↓
// Create chunks
//  ↓
// Store chunks
//  ↓
// Generate embeddings
//  ↓
// Store embeddings in pgvector
//
// ==========================================

export const uploadContract = async (req, res) => {
  try {
    // --------------------------------------
    // 1. Check PDF
    // --------------------------------------

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "PDF file is required",
      });
    }

    // --------------------------------------
    // 2. Extract PDF text
    // --------------------------------------

    const { text, pages } = await extractTextFromPdf(req.file.buffer);

    // --------------------------------------
    // 3. Create chunks
    // --------------------------------------

    const chunks = createChunks(text);

    if (chunks.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No usable text found in the PDF",
      });
    }

    console.log(`Created ${chunks.length} chunks`);

    // --------------------------------------
    // 4. Create contract
    // --------------------------------------

    const contract = await prisma.contract.create({
      data: {
        userId: req.userId,

        title: req.file.originalname.replace(/\.pdf$/i, ""),

        // We are NOT storing the PDF.
        fileUrl: "",

        type: "Unknown",
      },
    });

    console.log(`Contract created: ${contract.id}`);

    // --------------------------------------
    // 5. Store chunks
    // --------------------------------------

    const createdChunks = [];

    for (let index = 0; index < chunks.length; index++) {
      const chunk = await prisma.contractChunk.create({
        data: {
          contractId: contract.id,
          content: chunks[index],
          chunkIndex: index,
        },
      });

      createdChunks.push(chunk);
    }

    console.log(`Stored ${createdChunks.length} chunks`);

    // --------------------------------------
    // 6. Generate embeddings
    // --------------------------------------

    console.log("Generating embeddings...");

    const embeddings = await generateEmbeddings(chunks);

    console.log(`Generated ${embeddings.length} embeddings`);

    // --------------------------------------
    // 7. Store embeddings in pgvector
    // --------------------------------------

    console.log("Storing embeddings in pgvector...");

    for (let index = 0; index < createdChunks.length; index++) {
      await updateChunkEmbedding(createdChunks[index].id, embeddings[index]);
    }

    console.log("All embeddings stored successfully");

    // --------------------------------------
    // 8. Response
    // --------------------------------------

    return res.status(201).json({
      success: true,

      message: "Contract uploaded and processed successfully",

      contract: {
        id: contract.id,
        title: contract.title,
        pages,
        chunks: chunks.length,
        embeddings: embeddings.length,
      },
    });
  } catch (error) {
    console.error("Contract upload error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to process contract",
      error: error.message,
    });
  }
};
