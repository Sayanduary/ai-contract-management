import { generateEmbedding } from "../src/services/embedding.service.js";

const text = "This contract is valid for a period of twelve months.";

console.log("Generating embedding...");

const embedding = await generateEmbedding(text);

console.log("Is Array:", Array.isArray(embedding));
console.log("Is Float32Array:", embedding instanceof Float32Array);
console.log("Embedding length:", embedding.length);
console.log("First 5 values:", Array.from(embedding).slice(0, 5));
