-- DropForeignKey
ALTER TABLE "Highlight" DROP CONSTRAINT "Highlight_issueId_fkey";

-- DropForeignKey
ALTER TABLE "Highlight" DROP CONSTRAINT "Highlight_userId_fkey";

-- AddForeignKey
ALTER TABLE "Highlight" ADD CONSTRAINT "Highlight_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Highlight" ADD CONSTRAINT "Highlight_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
