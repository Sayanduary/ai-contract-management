CREATE EXTENSION IF NOT EXISTS vector;

ALTER TABLE "ContractChunk"
ADD COLUMN "embedding" vector(1024);

CREATE INDEX "ContractChunk_embedding_idx"
ON "ContractChunk"
USING hnsw ("embedding" vector_cosine_ops);