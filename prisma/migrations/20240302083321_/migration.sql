/*
  Warnings:

  - You are about to drop the column `orgID` on the `complain` table. All the data in the column will be lost.
  - You are about to alter the column `complainDate` on the `complain` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `complain` DROP COLUMN `orgID`,
    ADD COLUMN `agencyID` INTEGER UNSIGNED NULL,
    MODIFY `complainDate` DATETIME NOT NULL;

-- AddForeignKey
ALTER TABLE `complain` ADD CONSTRAINT `complain_agencyID_fkey` FOREIGN KEY (`agencyID`) REFERENCES `agency`(`agencyID`) ON DELETE SET NULL ON UPDATE CASCADE;
