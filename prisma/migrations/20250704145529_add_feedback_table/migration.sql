-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL,
    "lovedFeatures" TEXT,
    "wishToHaveFeatures" TEXT,
    "struggleToUseFeatures" TEXT,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);
