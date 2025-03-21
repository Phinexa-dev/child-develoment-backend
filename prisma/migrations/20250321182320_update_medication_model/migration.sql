-- CreateTable
CREATE TABLE "MedicineComposition" (
    "compId" SERIAL NOT NULL,
    "medID" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "unitOfMeasure" TEXT NOT NULL,
    "numberOfUnits" TEXT NOT NULL,

    CONSTRAINT "MedicineComposition_pkey" PRIMARY KEY ("compId")
);

-- AddForeignKey
ALTER TABLE "MedicineComposition" ADD CONSTRAINT "MedicineComposition_medID_fkey" FOREIGN KEY ("medID") REFERENCES "MedicineDef"("medID") ON DELETE CASCADE ON UPDATE CASCADE;
