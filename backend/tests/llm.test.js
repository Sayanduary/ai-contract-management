import "dotenv/config";
import { generateAnswer } from "../src/services/llm.service.js";

const answer = await generateAnswer(
  "What is the GST number?",
  `
  JEEVAN DEEP PHARMA
  GST NO: 19AAPFJ2820E1ZD
  DL NO: WB/KOL/BIO/W/265474
  FSSAI REG. NO: 228190430000356
  `,
);

console.log("\nAI ANSWER:\n");
console.log(answer);
