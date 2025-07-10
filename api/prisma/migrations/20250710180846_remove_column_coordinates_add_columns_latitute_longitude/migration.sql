/*
  Warnings:

  - You are about to drop the column `coordinates` on the `Issue` table. All the data in the column will be lost.
  - Added the required column `latitute` to the `Issue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Issue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Issue" DROP COLUMN "coordinates",
ADD COLUMN     "latitute" INTEGER NOT NULL,
ADD COLUMN     "longitude" INTEGER NOT NULL;
