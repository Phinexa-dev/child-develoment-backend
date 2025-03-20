/*
  Warnings:

  - Made the column `dayTime` on table `MedicationSlot` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "MedicationSlot" ALTER COLUMN "dayTime" SET NOT NULL,
ALTER COLUMN "dayTime" SET DATA TYPE TEXT;
