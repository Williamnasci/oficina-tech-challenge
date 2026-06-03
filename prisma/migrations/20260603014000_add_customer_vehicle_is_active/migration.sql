-- AlterTable
ALTER TABLE "Customer" ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;
