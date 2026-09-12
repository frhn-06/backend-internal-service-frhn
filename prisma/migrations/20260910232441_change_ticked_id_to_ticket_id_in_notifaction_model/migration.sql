/*
  Warnings:

  - You are about to drop the column `tickedId` on the `Notification` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_tickedId_fkey";

-- DropIndex
DROP INDEX "Notification_tickedId_idx";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "tickedId",
ADD COLUMN     "ticketId" INTEGER;

-- CreateIndex
CREATE INDEX "Notification_ticketId_idx" ON "Notification"("ticketId");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE SET NULL ON UPDATE CASCADE;
