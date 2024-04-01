/*
  Warnings:

  - The primary key for the `caseagency` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `caseagency` DROP FOREIGN KEY `caseagency_agencyID_fkey`;

-- AlterTable
ALTER TABLE `caseagency` DROP PRIMARY KEY,
    MODIFY `agencyID` INTEGER UNSIGNED NULL,
    ADD PRIMARY KEY (`complainID`, `caseagnecyDate`);

-- AddForeignKey
ALTER TABLE `caseagency` ADD CONSTRAINT `caseagency_agencyID_fkey` FOREIGN KEY (`agencyID`) REFERENCES `agency`(`agencyID`) ON DELETE SET NULL ON UPDATE CASCADE;
