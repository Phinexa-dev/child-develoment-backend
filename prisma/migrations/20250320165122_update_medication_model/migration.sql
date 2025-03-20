/*
  Warnings:

  - You are about to drop the column `dayTime` on the `MedicationSlot` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MedicationSlot" DROP COLUMN "dayTime",
ADD COLUMN     "date" TIMESTAMP(3),
ADD COLUMN     "timeOfDay" TEXT;
