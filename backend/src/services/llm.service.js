import { ChatGroq } from "@langchain/groq";

let llm = null;

const getLLM = () => {
  if (!llm) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is not configured");
    }

    llm = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      model: "openai/gpt-oss-120b",
      temperature: 0,
    });
  }

  return llm;
};

export const generateAnswer = async (question, context) => {
  const model = getLLM();

  const prompt = `
You are an AI contract analysis assistant.

Answer the user's question using ONLY the contract context provided below.

Rules:
- Do not invent information.
- If the answer is not present in the context, say that the information
  could not be found in the contract.
- Keep the answer clear and concise.
- Do not provide legal advice.
- Mention uncertainty when the contract text is unclear.

CONTRACT CONTEXT:
${context}

USER QUESTION:
${question}
`;

  const response = await model.invoke(prompt);

  return response.content;
};
