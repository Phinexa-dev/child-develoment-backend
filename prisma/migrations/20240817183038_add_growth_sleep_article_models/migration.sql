/*
  Warnings:

  - You are about to drop the `Classes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Classes";

-- CreateTable
CREATE TABLE "Parent" (
    "parentId" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "image" TEXT,
    "bloodGroup" TEXT,
    "phoneNumber" TEXT NOT NULL,
    "address" TEXT,

    CONSTRAINT "Parent_pkey" PRIMARY KEY ("parentId")
);

-- CreateTable
CREATE TABLE "Child" (
    "childId" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "lastName" TEXT NOT NULL,
    "birthday" TIMESTAMP(3) NOT NULL,
    "region" TEXT NOT NULL,
    "image" TEXT,
    "gender" TEXT NOT NULL,
    "bloodGroup" TEXT,

    CONSTRAINT "Child_pkey" PRIMARY KEY ("childId")
);

-- CreateTable
CREATE TABLE "ParentChild" (
    "id" SERIAL NOT NULL,
    "parentId" INTEGER NOT NULL,
    "childId" INTEGER NOT NULL,
    "relation" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "requestedDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ParentChild_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OldPasswords" (
    "id" SERIAL NOT NULL,
    "parentId" INTEGER NOT NULL,
    "password" TEXT NOT NULL,
    "changedOn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OldPasswords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Nursing" (
    "id" SERIAL NOT NULL,
    "childId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "leftDuration" INTEGER,
    "rightDuration" INTEGER,
    "notes" TEXT,

    CONSTRAINT "Nursing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bottle" (
    "id" SERIAL NOT NULL,
    "childId" INTEGER NOT NULL,
    "typeId" INTEGER NOT NULL,
    "volume" DOUBLE PRECISION,
    "stash" DOUBLE PRECISION,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,

    CONSTRAINT "Bottle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Solids" (
    "solidId" SERIAL NOT NULL,
    "childId" INTEGER NOT NULL,
    "reaction" TEXT,
    "note" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Solids_pkey" PRIMARY KEY ("solidId")
);

-- CreateTable
CREATE TABLE "SolidCat" (
    "id" SERIAL NOT NULL,
    "solidId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "weightVolume" DOUBLE PRECISION,

    CONSTRAINT "SolidCat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "categoryId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("categoryId")
);

-- CreateTable
CREATE TABLE "CategoryItems" (
    "itemId" SERIAL NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "isDefault" BOOLEAN NOT NULL,
    "parentId" INTEGER,
    "weight" DOUBLE PRECISION,

    CONSTRAINT "CategoryItems_pkey" PRIMARY KEY ("itemId")
);

-- CreateTable
CREATE TABLE "MilkType" (
    "typeID" SERIAL NOT NULL,
    "milkType" TEXT NOT NULL,

    CONSTRAINT "MilkType_pkey" PRIMARY KEY ("typeID")
);

-- CreateTable
CREATE TABLE "Medication" (
    "id" SERIAL NOT NULL,
    "childId" INTEGER NOT NULL,
    "medID" INTEGER NOT NULL,
    "startingDate" TIMESTAMP(3) NOT NULL,
    "endingDate" TIMESTAMP(3) NOT NULL,
    "frequency" TEXT NOT NULL,

    CONSTRAINT "Medication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicationSlot" (
    "medicationSlotId" SERIAL NOT NULL,
    "medicationId" INTEGER NOT NULL,
    "option" TEXT NOT NULL,
    "time" TIMESTAMP(3),
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "MedicationSlot_pkey" PRIMARY KEY ("medicationSlotId")
);

-- CreateTable
CREATE TABLE "Medicine" (
    "medID" SERIAL NOT NULL,

    CONSTRAINT "Medicine_pkey" PRIMARY KEY ("medID")
);

-- CreateTable
CREATE TABLE "MedicineDef" (
    "medID" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "form" TEXT NOT NULL,

    CONSTRAINT "MedicineDef_pkey" PRIMARY KEY ("medID")
);

-- CreateTable
CREATE TABLE "MedicineCus" (
    "medID" INTEGER NOT NULL,
    "parentId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "form" TEXT NOT NULL,

    CONSTRAINT "MedicineCus_pkey" PRIMARY KEY ("medID")
);

-- CreateTable
CREATE TABLE "SolidsAlergy" (
    "id" SERIAL NOT NULL,
    "itemId" INTEGER NOT NULL,
    "childId" INTEGER NOT NULL,
    "note" TEXT,

    CONSTRAINT "SolidsAlergy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MilkAlergy" (
    "id" SERIAL NOT NULL,
    "typeId" INTEGER NOT NULL,
    "childId" INTEGER NOT NULL,
    "note" TEXT,

    CONSTRAINT "MilkAlergy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicineAlergy" (
    "id" SERIAL NOT NULL,
    "medId" INTEGER NOT NULL,
    "childId" INTEGER NOT NULL,
    "note" TEXT,

    CONSTRAINT "MedicineAlergy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OtherAlergy" (
    "id" SERIAL NOT NULL,
    "childId" INTEGER NOT NULL,
    "allergicTo" TEXT NOT NULL,
    "note" TEXT,

    CONSTRAINT "OtherAlergy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Growth" (
    "id" SERIAL NOT NULL,
    "childId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "weight" DOUBLE PRECISION,
    "height" DOUBLE PRECISION,
    "note" TEXT,

    CONSTRAINT "Growth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sleep" (
    "sleepId" SERIAL NOT NULL,
    "childId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "note" TEXT,
    "sleepStyle" TEXT,

    CONSTRAINT "Sleep_pkey" PRIMARY KEY ("sleepId")
);

-- CreateTable
CREATE TABLE "Article" (
    "articleId" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "image" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "author" TEXT NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("articleId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Parent_email_key" ON "Parent"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Parent_phoneNumber_key" ON "Parent"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "SolidCat_itemId_key" ON "SolidCat"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "CategoryItems_categoryId_itemId_key" ON "CategoryItems"("categoryId", "itemId");

-- AddForeignKey
ALTER TABLE "ParentChild" ADD CONSTRAINT "ParentChild_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Parent"("parentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParentChild" ADD CONSTRAINT "ParentChild_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("childId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OldPasswords" ADD CONSTRAINT "OldPasswords_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Parent"("parentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nursing" ADD CONSTRAINT "Nursing_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("childId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bottle" ADD CONSTRAINT "Bottle_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("childId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bottle" ADD CONSTRAINT "Bottle_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "MilkType"("typeID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solids" ADD CONSTRAINT "Solids_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("childId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolidCat" ADD CONSTRAINT "SolidCat_solidId_fkey" FOREIGN KEY ("solidId") REFERENCES "Solids"("solidId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolidCat" ADD CONSTRAINT "SolidCat_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "CategoryItems"("itemId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryItems" ADD CONSTRAINT "CategoryItems_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("categoryId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medication" ADD CONSTRAINT "Medication_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("childId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medication" ADD CONSTRAINT "Medication_medID_fkey" FOREIGN KEY ("medID") REFERENCES "Medicine"("medID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicationSlot" ADD CONSTRAINT "MedicationSlot_medicationId_fkey" FOREIGN KEY ("medicationId") REFERENCES "Medication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicineDef" ADD CONSTRAINT "MedicineDef_medID_fkey" FOREIGN KEY ("medID") REFERENCES "Medicine"("medID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicineCus" ADD CONSTRAINT "MedicineCus_medID_fkey" FOREIGN KEY ("medID") REFERENCES "Medicine"("medID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicineCus" ADD CONSTRAINT "MedicineCus_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Parent"("parentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolidsAlergy" ADD CONSTRAINT "SolidsAlergy_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "SolidCat"("itemId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolidsAlergy" ADD CONSTRAINT "SolidsAlergy_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("childId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MilkAlergy" ADD CONSTRAINT "MilkAlergy_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "MilkType"("typeID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MilkAlergy" ADD CONSTRAINT "MilkAlergy_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("childId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicineAlergy" ADD CONSTRAINT "MedicineAlergy_medId_fkey" FOREIGN KEY ("medId") REFERENCES "Medicine"("medID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicineAlergy" ADD CONSTRAINT "MedicineAlergy_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("childId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OtherAlergy" ADD CONSTRAINT "OtherAlergy_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("childId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Growth" ADD CONSTRAINT "Growth_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("childId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sleep" ADD CONSTRAINT "Sleep_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("childId") ON DELETE RESTRICT ON UPDATE CASCADE;
