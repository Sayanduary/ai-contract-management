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

  console.log("Contract ID:", contractId);
  console.log("Query embedding length:", queryEmbedding.length);
  console.log("Query vector prefix:", vector.slice(0, 100));

  const results = await prisma.$queryRawUnsafe(
    `
      SELECT
        id,
        "contractId",
        content,
        "chunkIndex",
        1 - (embedding <=> $2::vector) AS similarity
      FROM "ContractChunk"
      WHERE "contractId" = $1
        AND embedding IS NOT NULL
      ORDER BY embedding <=> $2::vector
      LIMIT $3
    `,
    contractId,
    vector,
    topK,
  );

  console.log("Vector search results:", results);

  return results;
};
