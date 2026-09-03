import { ChatGroq } from "@langchain/groq";

const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "openai/gpt-oss-120b",
  temperature: 0,
});

export const analyzeContract = async (contractText) => {
  const prompt = `
You are an AI contract analysis assistant.

Analyze the following contract text.

Return ONLY valid JSON with this exact structure:

{
  "summary": "A concise summary of the contract",

  "type": "Contract type",

  "startDate": "YYYY-MM-DD",

  "expiryDate": "YYYY-MM-DD",

  "clauses": [
    {
      "name": "Clause name",
      "description": "What the clause means"
    }
  ],

  "riskLevel": "LOW",

  "risks": [
    {
      "title": "Risk title",
      "description": "Explanation of the risk"
    }
  ]
}

Rules:

- riskLevel must be exactly one of: LOW, MEDIUM, HIGH.
- Identify important clauses actually present in the contract.
- Identify potential risks actually supported by the contract text.
- Do not invent missing clauses or information.
- If no significant risk is found, return an empty risks array.
- Identify the most appropriate contract type from the document.
- If the document is not actually a contract or the type cannot be determined, return "Unknown".
- Extract the contract start date only if it is clearly present.
- Extract the contract expiry/end date only if it is clearly present.
- Dates must use YYYY-MM-DD format.
- If the start date is not present, return null.
- If the expiry date is not present, return null.
- Do not guess or infer dates.
- Do not provide legal advice.
- Return JSON only.
- Do not use markdown or code fences.

CONTRACT:

${contractText}
`;

  const response = await model.invoke(prompt);

  const content =
    typeof response.content === "string"
      ? response.content
      : JSON.stringify(response.content);

  // Remove accidental markdown code fences
  const cleaned = content
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    const result = JSON.parse(cleaned);

    return {
      summary: result.summary || "",
      type: result.type || "Unknown",
      startDate: result.startDate || null,
      expiryDate: result.expiryDate || null,
      clauses: Array.isArray(result.clauses) ? result.clauses : [],
      riskLevel: ["LOW", "MEDIUM", "HIGH"].includes(result.riskLevel)
        ? result.riskLevel
        : "LOW",
      risks: Array.isArray(result.risks) ? result.risks : [],
    };
  } catch (error) {
    console.error("AI analysis JSON:", content);
    throw new Error("AI returned invalid analysis JSON");
  }
};
