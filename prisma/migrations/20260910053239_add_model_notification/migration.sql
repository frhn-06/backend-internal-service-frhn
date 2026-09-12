-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('TICKET_CREATED', 'TICKET_TAKEN', 'TICKET_WAITING', 'TICKET_IN_PROGRESS', 'TICKET_RESOLVED', 'TICKET_REOPENED', 'TICKET_CLOSED', 'TICKET_CANCELLED', 'MESSAGE_RECEIVED');

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "targetId" INTEGER NOT NULL,
    "actorId" INTEGER,
    "tickedId" INTEGER,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Notification_targetId_isRead_idx" ON "Notification"("targetId", "isRead");

-- CreateIndex
CREATE INDEX "Notification_tickedId_idx" ON "Notification"("tickedId");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_tickedId_fkey" FOREIGN KEY ("tickedId") REFERENCES "Ticket"("id") ON DELETE SET NULL ON UPDATE CASCADE;
