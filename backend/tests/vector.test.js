import prisma from "../src/config/db.js";
import { generateEmbedding } from "../src/services/embedding.service.js";

const text = "This contract is valid for twelve months.";

console.log("Generating embedding...");

const embedding = await generateEmbedding(text);

console.log("Embedding dimensions:", embedding.length);

const testChunk = await prisma.contractChunk.findFirst();

if (!testChunk) {
  throw new Error(
    "No ContractChunk found. Upload a PDF first so a chunk exists.",
  );
}

const vector = `[${embedding.join(",")}]`;

await prisma.$executeRawUnsafe(
  `
    UPDATE "ContractChunk"
    SET "embedding" = $1::vector
    WHERE "id" = $2
  `,
  vector,
  testChunk.id,
);

console.log("Embedding stored successfully.");

await prisma.$disconnect();
