import prisma from "../src/config/db.js";
import { generateEmbedding } from "../src/services/embedding.service.js";
import { searchSimilarChunks } from "../src/services/vector-search.service.js";

const contractId = "cmtlnoomz00007sqdh9ca4shv";

const question = "What information is mentioned in this contract?";

console.log("Generating query embedding...");

const queryEmbedding = await generateEmbedding(question);

console.log("Query embedding dimensions:", queryEmbedding.length);

console.log("Searching similar chunks...");

const results = await searchSimilarChunks(contractId, queryEmbedding, 5);

console.log("\nRetrieved chunks:");

for (const result of results) {
  console.log("\n-------------------------");
  console.log("Chunk:", result.chunkIndex);
  console.log("Similarity:", result.similarity);
  console.log("Content:", result.content);
}

await prisma.$disconnect();
