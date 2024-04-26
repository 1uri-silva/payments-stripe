-- CreateTable
CREATE TABLE "stripe_payments" (
    "id" TEXT NOT NULL,
    "stripeCustomerId" TEXT,
    "stripeCustomerStatus" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "stripe_payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "stripe_payments_userId_key" ON "stripe_payments"("userId");

-- AddForeignKey
ALTER TABLE "stripe_payments" ADD CONSTRAINT "stripe_payments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
