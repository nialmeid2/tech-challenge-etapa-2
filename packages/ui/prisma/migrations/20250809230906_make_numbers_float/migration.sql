/*
  Warnings:

  - You are about to alter the column `value` on the `Transaction` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `balance` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "public"."Transaction" ALTER COLUMN "value" SET DEFAULT 0,
ALTER COLUMN "value" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "balance" SET DATA TYPE DOUBLE PRECISION;
