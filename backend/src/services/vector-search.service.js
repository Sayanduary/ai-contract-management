import prisma from "../config/db.js";

export const searchSimilarChunks = async (
  contractId,
  queryEmbedding,
  topK = 5,
) => {
  if (!Array.isArray(queryEmbedding)) {
    throw new Error("Query embedding must be an array");
  }

  if (queryEmbedding.length !== 384) {
    throw new Error(
      `Invalid query embedding dimensions: ${queryEmbedding.length}`,
    );
  }

  const vector = `[${queryEmbedding.join(",")}]`;

  const results = await prisma.$queryRaw`
    SELECT
      id,
      "contractId",
      content,
      "chunkIndex",
      1 - (embedding <=> ${vector}::vector) AS similarity
    FROM "ContractChunk"
    WHERE "contractId" = ${contractId}
      AND embedding IS NOT NULL
    ORDER BY embedding <=> ${vector}::vector
    LIMIT ${topK}
  `;

  return results;
};
