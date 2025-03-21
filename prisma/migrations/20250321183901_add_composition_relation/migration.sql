/*
  Warnings:

  - Changed the type of `numberOfUnits` on the `MedicineComposition` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "MedicineComposition" DROP COLUMN "numberOfUnits",
ADD COLUMN     "numberOfUnits" INTEGER NOT NULL;
