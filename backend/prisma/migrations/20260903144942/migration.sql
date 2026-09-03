/*
  Warnings:

  - You are about to drop the column `embedding` on the `ContractChunk` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "ContractChunk_embedding_idx";

-- AlterTable
ALTER TABLE "ContractChunk" DROP COLUMN "embedding";
