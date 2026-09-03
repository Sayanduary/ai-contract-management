-- CreateTable
CREATE TABLE "ContractChunk" (
    "id" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "chunkIndex" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContractChunk_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ContractChunk_contractId_idx" ON "ContractChunk"("contractId");

-- CreateIndex
CREATE UNIQUE INDEX "ContractChunk_contractId_chunkIndex_key" ON "ContractChunk"("contractId", "chunkIndex");

-- AddForeignKey
ALTER TABLE "ContractChunk" ADD CONSTRAINT "ContractChunk_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE CASCADE ON UPDATE CASCADE;
