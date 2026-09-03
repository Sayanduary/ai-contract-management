import { FlagEmbedding, EmbeddingModel } from "fastembed";

let embeddingModel = null;

const getEmbeddingModel = async () => {
  if (!embeddingModel) {
    console.log("Loading embedding model...");

    embeddingModel = await FlagEmbedding.init({
      model: EmbeddingModel.BGESmallENV15,
    });

    console.log("Embedding model loaded.");
  }

  return embeddingModel;
};

export const generateEmbedding = async (text) => {
  const model = await getEmbeddingModel();

  const result = model.embed([text]);

  for await (const embeddings of result) {
    return Array.from(embeddings[0]);
  }

  throw new Error("Failed to generate embedding");
};

export const generateEmbeddings = async (texts) => {
  const model = await getEmbeddingModel();

  const embeddings = [];

  const result = model.embed(texts);

  for await (const embedding of result) {
    embeddings.push(Array.from(embedding));
  }

  return embeddings;
};
