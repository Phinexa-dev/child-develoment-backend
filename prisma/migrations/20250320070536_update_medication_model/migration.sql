/*
  Warnings:

  - You are about to drop the column `time` on the `MedicationSlot` table. All the data in the column will be lost.
  - You are about to alter the column `amount` on the `MedicationSlot` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "MedicationSlot" DROP COLUMN "time",
ADD COLUMN     "dayTime" TIMESTAMP(3),
ALTER COLUMN "amount" SET DATA TYPE INTEGER,
ALTER COLUMN "status" SET DEFAULT 'not_taken';
