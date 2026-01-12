/*
  Warnings:

  - Added the required column `capacity` to the `CoworkingSpace` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CoworkingSpace" ADD COLUMN     "capacity" INTEGER NOT NULL;
