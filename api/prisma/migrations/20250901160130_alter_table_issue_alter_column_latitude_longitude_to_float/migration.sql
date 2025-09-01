/*
  Warnings:

  - Changed the type of `longitude` on the `Issue` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `latitude` on the `Issue` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Issue"
  ALTER COLUMN "latitude" TYPE DOUBLE PRECISION USING "latitude"::DOUBLE PRECISION,
  ALTER COLUMN "longitude" TYPE DOUBLE PRECISION USING "longitude"::DOUBLE PRECISION;
