/*
  Warnings:

  - Added the required column `itemName` to the `CategoryItems` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CategoryItems" ADD COLUMN     "itemName" TEXT NOT NULL;
