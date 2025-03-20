/*
  Warnings:

  - You are about to drop the column `medID` on the `Medication` table. All the data in the column will be lost.
  - Added the required column `interval` to the `Medication` table without a default value. This is not possible if the table is not empty.
  - Added the required column `medicineId` to the `Medication` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Medication" DROP CONSTRAINT "Medication_medID_fkey";

-- AlterTable
ALTER TABLE "Medication" DROP COLUMN "medID",
ADD COLUMN     "interval" INTEGER NOT NULL,
ADD COLUMN     "medicineId" INTEGER NOT NULL,
ADD COLUMN     "note" TEXT;

-- AlterTable
ALTER TABLE "MedicationSlot" ALTER COLUMN "option" DROP NOT NULL,
ALTER COLUMN "status" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Medication" ADD CONSTRAINT "Medication_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "Medicine"("medID") ON DELETE RESTRICT ON UPDATE CASCADE;
