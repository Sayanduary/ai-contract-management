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
    const embedding = Array.from(embeddings[0]);

    console.log("Generated embedding dimensions:", embedding.length);

    if (embedding.length !== 384) {
      throw new Error(
        `Invalid embedding dimensions: expected 384, received ${embedding.length}`
      );
    }

    return embedding;
  }

  throw new Error("Failed to generate embedding");
};

export const generateEmbeddings = async (texts) => {
  const model = await getEmbeddingModel();

  const embeddings = [];

  const result = model.embed(texts);

  for await (const batch of result) {
    for (const embedding of batch) {
      const vector = Array.from(embedding);

      console.log(
        "Generated embedding dimensions:",
        vector.length
      );

      if (vector.length !== 384) {
        throw new Error(
          `Invalid embedding dimensions: expected 384, received ${vector.length}`
        );
      }

      embeddings.push(vector);
    }
  }

  return embeddings;
};