-- CreateTable
CREATE TABLE "Availability" (
    "id" SERIAL NOT NULL,
    "consultantId" INTEGER NOT NULL,
    "startHour" INTEGER NOT NULL,
    "startMinutes" INTEGER NOT NULL,
    "endHour" INTEGER NOT NULL,
    "endMinutes" INTEGER NOT NULL,
    "day" TEXT NOT NULL,

    CONSTRAINT "Availability_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Availability" ADD CONSTRAINT "Availability_consultantId_fkey" FOREIGN KEY ("consultantId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
