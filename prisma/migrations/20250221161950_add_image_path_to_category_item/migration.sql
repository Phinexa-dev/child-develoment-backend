/*
  Warnings:

  - Added the required column `isDefault` to the `CategoryItems` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CategoryItems" ADD COLUMN     "isDefault" BOOLEAN NOT NULL;
