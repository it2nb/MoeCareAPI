/*
  Warnings:

  - You are about to alter the column `caseagnecyDate` on the `caseagency` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `caseagencyUpdate` on the `caseagency` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `complainDate` on the `complain` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `caseagency` MODIFY `caseagnecyDate` DATETIME NOT NULL,
    MODIFY `caseagencyUpdate` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `complain` MODIFY `complainDate` DATETIME NOT NULL;
