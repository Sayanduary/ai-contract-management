import prisma from "../config/db.js";

export const updateChunkEmbedding = async (chunkId, embedding) => {
  const vector = `[${embedding.join(",")}]`;

  await prisma.$executeRawUnsafe(
    `
      UPDATE "ContractChunk"
      SET "embedding" = $1::vector
      WHERE "id" = $2
    `,
    vector,
    chunkId,
  );
};
