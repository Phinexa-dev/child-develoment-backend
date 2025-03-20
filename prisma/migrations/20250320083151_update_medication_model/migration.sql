/*
  Warnings:

  - The primary key for the `Medicine` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `medID` on the `Medicine` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Medication" DROP CONSTRAINT "Medication_medicineId_fkey";

-- DropForeignKey
ALTER TABLE "MedicineAlergy" DROP CONSTRAINT "MedicineAlergy_medId_fkey";

-- DropForeignKey
ALTER TABLE "MedicineCus" DROP CONSTRAINT "MedicineCus_medID_fkey";

-- DropForeignKey
ALTER TABLE "MedicineDef" DROP CONSTRAINT "MedicineDef_medID_fkey";

-- AlterTable
ALTER TABLE "Medicine" DROP CONSTRAINT "Medicine_pkey",
DROP COLUMN "medID",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Medicine_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Medication" ADD CONSTRAINT "Medication_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "Medicine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicineDef" ADD CONSTRAINT "MedicineDef_medID_fkey" FOREIGN KEY ("medID") REFERENCES "Medicine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicineCus" ADD CONSTRAINT "MedicineCus_medID_fkey" FOREIGN KEY ("medID") REFERENCES "Medicine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicineAlergy" ADD CONSTRAINT "MedicineAlergy_medId_fkey" FOREIGN KEY ("medId") REFERENCES "Medicine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
