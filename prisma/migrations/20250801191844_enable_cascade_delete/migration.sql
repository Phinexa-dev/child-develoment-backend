-- DropForeignKey
ALTER TABLE "OldPasswords" DROP CONSTRAINT "OldPasswords_parentId_fkey";

-- DropForeignKey
ALTER TABLE "ParentChild" DROP CONSTRAINT "ParentChild_parentId_fkey";

-- AddForeignKey
ALTER TABLE "ParentChild" ADD CONSTRAINT "ParentChild_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Parent"("parentId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OldPasswords" ADD CONSTRAINT "OldPasswords_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Parent"("parentId") ON DELETE CASCADE ON UPDATE CASCADE;
