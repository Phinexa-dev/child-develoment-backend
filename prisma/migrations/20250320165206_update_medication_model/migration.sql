/*
  Warnings:

  - Made the column `date` on table `MedicationSlot` required. This step will fail if there are existing NULL values in that column.
  - Made the column `timeOfDay` on table `MedicationSlot` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "MedicationSlot" ALTER COLUMN "date" SET NOT NULL,
ALTER COLUMN "timeOfDay" SET NOT NULL;
