-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "paymentMethod" TEXT NOT NULL DEFAULT 'credits',
ALTER COLUMN "productName" DROP NOT NULL;
