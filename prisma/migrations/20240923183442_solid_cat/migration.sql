/*
  Warnings:

  - You are about to drop the column `weight` on the `CategoryItems` table. All the data in the column will be lost.
  - Added the required column `isSolid` to the `CategoryItems` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CategoryItems" DROP COLUMN "weight",
ADD COLUMN     "isSolid" BOOLEAN NOT NULL;

-- AddForeignKey
ALTER TABLE "CategoryItems" ADD CONSTRAINT "CategoryItems_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Parent"("parentId") ON DELETE SET NULL ON UPDATE CASCADE;
