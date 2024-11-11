-- DropForeignKey
ALTER TABLE "SolidsAlergy" DROP CONSTRAINT "SolidsAlergy_itemId_fkey";

-- DropIndex
DROP INDEX "SolidCat_itemId_key";

-- AddForeignKey
ALTER TABLE "SolidsAlergy" ADD CONSTRAINT "SolidsAlergy_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "CategoryItems"("itemId") ON DELETE RESTRICT ON UPDATE CASCADE;
