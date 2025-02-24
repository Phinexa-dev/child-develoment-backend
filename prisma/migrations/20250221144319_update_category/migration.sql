/*
  Warnings:

  - You are about to drop the column `isSolid` on the `CategoryItems` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Nursing` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `Nursing` table. All the data in the column will be lost.
  - You are about to drop the column `weightVolume` on the `SolidCat` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Solids` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `Solids` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Bottle" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "CategoryItems" DROP COLUMN "isSolid",
ADD COLUMN     "imagePath" TEXT,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Growth" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Medication" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "MedicationSlot" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "MedicineCus" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "MedicineDef" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "MilkType" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Nursing" DROP COLUMN "date",
DROP COLUMN "time",
ADD COLUMN     "endingTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "startingTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Sleep" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "SolidCat" DROP COLUMN "weightVolume",
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "numberOfUnits" DOUBLE PRECISION,
ADD COLUMN     "unitOfMeasure" TEXT NOT NULL DEFAULT 'g';

-- AlterTable
ALTER TABLE "Solids" DROP COLUMN "date",
DROP COLUMN "time",
ADD COLUMN     "dateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "School" (
    "sid" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "School_pkey" PRIMARY KEY ("sid")
);

-- CreateTable
CREATE TABLE "Allergies" (
    "allergyId" SERIAL NOT NULL,
    "childId" INTEGER NOT NULL,
    "note" TEXT,
    "type" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Allergies_pkey" PRIMARY KEY ("allergyId")
);

-- CreateTable
CREATE TABLE "Vaccine" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "notes" TEXT,
    "period" TEXT,
    "ageInMonths" INTEGER NOT NULL,
    "whereTo" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Vaccine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vaccination" (
    "id" SERIAL NOT NULL,
    "childId" INTEGER NOT NULL,
    "vaccineId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "venue" TEXT,
    "notes" TEXT,
    "country" TEXT,
    "status" TEXT NOT NULL DEFAULT 'not taken',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Vaccination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Symptom" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Symptom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "postSymptom" (
    "id" SERIAL NOT NULL,
    "vaccinationId" INTEGER NOT NULL,
    "symptomId" INTEGER NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "postSymptom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VaccinationImages" (
    "id" SERIAL NOT NULL,
    "image" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "vaccinationId" INTEGER NOT NULL,

    CONSTRAINT "VaccinationImages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointments" (
    "id" SERIAL NOT NULL,
    "childId" INTEGER NOT NULL,
    "doctor" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "note" TEXT,
    "venue" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "appointmentNumber" INTEGER,

    CONSTRAINT "Appointments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HealthRecords" (
    "id" SERIAL NOT NULL,
    "childId" INTEGER NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "title" TEXT NOT NULL,
    "file" TEXT NOT NULL,
    "notes" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HealthRecords_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Allergies" ADD CONSTRAINT "Allergies_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("childId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vaccination" ADD CONSTRAINT "Vaccination_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("childId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vaccination" ADD CONSTRAINT "Vaccination_vaccineId_fkey" FOREIGN KEY ("vaccineId") REFERENCES "Vaccine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postSymptom" ADD CONSTRAINT "postSymptom_vaccinationId_fkey" FOREIGN KEY ("vaccinationId") REFERENCES "Vaccination"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postSymptom" ADD CONSTRAINT "postSymptom_symptomId_fkey" FOREIGN KEY ("symptomId") REFERENCES "Symptom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VaccinationImages" ADD CONSTRAINT "VaccinationImages_vaccinationId_fkey" FOREIGN KEY ("vaccinationId") REFERENCES "Vaccination"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointments" ADD CONSTRAINT "Appointments_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("childId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HealthRecords" ADD CONSTRAINT "HealthRecords_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("childId") ON DELETE RESTRICT ON UPDATE CASCADE;
