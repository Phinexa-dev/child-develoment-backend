/*
  Warnings:

  - You are about to drop the column `endingDate` on the `Medication` table. All the data in the column will be lost.
  - You are about to drop the column `startingDate` on the `Medication` table. All the data in the column will be lost.
  - Added the required column `endDate` to the `Medication` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Medication` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Medication" DROP COLUMN "endingDate",
DROP COLUMN "startingDate",
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;
