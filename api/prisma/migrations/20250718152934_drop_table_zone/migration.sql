/*
  Warnings:

  - You are about to drop the column `zoneId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Zone` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_zoneId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "zoneId";

-- DropTable
DROP TABLE "Zone";
