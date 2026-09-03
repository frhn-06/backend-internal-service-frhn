-- CreateTable
CREATE TABLE "TicketSequence" (
    "year" INTEGER NOT NULL,
    "sequence" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TicketSequence_pkey" PRIMARY KEY ("year")
);
