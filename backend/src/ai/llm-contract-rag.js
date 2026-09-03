import { StateGraph, START, END } from "@langchain/langgraph";

import { generateEmbedding } from "../services/embedding.service.js";
import { searchSimilarChunks } from "../services/vector-search.service.js";
import { generateAnswer } from "../services/llm.service.js";

// ==========================================
// RETRIEVE CHUNKS
// ==========================================

const retrieveChunksNode = async (state) => {
  const queryEmbedding = await generateEmbedding(state.question);

  const chunks = await searchSimilarChunks(state.contractId, queryEmbedding, 5);

  return {
    chunks,
  };
};

// ==========================================
// CHECK RELEVANCE
// ==========================================

const checkRelevanceNode = async (state) => {
  if (!state.chunks || state.chunks.length === 0) {
    return {
      context: "",
    };
  }

  const relevantChunks = state.chunks.filter(
    (chunk) => Number(chunk.similarity) >= 0.45,
  );

  if (relevantChunks.length === 0) {
    return {
      context: "",
    };
  }

  return {
    chunks: relevantChunks,
  };
};

// ==========================================
// BUILD CONTEXT
// ==========================================

const buildContextNode = async (state) => {
  const context = state.chunks
    .map((chunk, index) => `[Contract Chunk ${index + 1}]\n${chunk.content}`)
    .join("\n\n");

  return {
    context,
  };
};

// ==========================================
// GENERATE ANSWER
// ==========================================

const generateAnswerNode = async (state) => {
  if (!state.context) {
    return {
      answer:
        "I could not find relevant information for this question in the contract.",
    };
  }

  const answer = await generateAnswer(state.question, state.context);

  return {
    answer,
  };
};
// ==========================================
// GRAPH STATE
// ==========================================

const graph = new StateGraph({
  channels: {
    question: {
      value: (previous, next) => next ?? previous,
      default: () => "",
    },

    contractId: {
      value: (previous, next) => next ?? previous,
      default: () => "",
    },

    chunks: {
      value: (previous, next) => next ?? previous,
      default: () => [],
    },

    context: {
      value: (previous, next) => next ?? previous,
      default: () => "",
    },

    answer: {
      value: (previous, next) => next ?? previous,
      default: () => "",
    },
  },
});

// ==========================================
// GRAPH NODES
// ==========================================

graph
  .addNode("retrieveChunks", retrieveChunksNode)
  .addNode("checkRelevance", checkRelevanceNode)
  .addNode("buildContext", buildContextNode)
  .addNode("generateAnswer", generateAnswerNode);

// ==========================================
// GRAPH FLOW
// ==========================================

graph.addEdge(START, "retrieveChunks");

graph.addEdge("retrieveChunks", "checkRelevance");

graph.addEdge("checkRelevance", "buildContext");

graph.addEdge("buildContext", "generateAnswer");

graph.addEdge("generateAnswer", END);

// ==========================================
// COMPILE
// ==========================================

export const contractRagGraph = graph.compile();
