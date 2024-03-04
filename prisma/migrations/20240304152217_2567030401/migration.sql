/*
  Warnings:

  - You are about to alter the column `caseagnecyDate` on the `caseagency` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `caseagencyUpdate` on the `caseagency` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to drop the column `complainType` on the `complain` table. All the data in the column will be lost.
  - You are about to alter the column `complainDate` on the `complain` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - Added the required column `complaintypeID` to the `complain` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `caseagency` MODIFY `caseagnecyDate` DATETIME NOT NULL,
    MODIFY `caseagencyUpdate` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `complain` DROP COLUMN `complainType`,
    ADD COLUMN `complaintypeID` INTEGER UNSIGNED NOT NULL,
    MODIFY `complainDate` DATETIME NOT NULL;

-- CreateTable
CREATE TABLE `complaintype` (
    `complaintypeID` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `complaintypeName` VARCHAR(200) NOT NULL,

    PRIMARY KEY (`complaintypeID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `complain` ADD CONSTRAINT `complain_complaintypeID_fkey` FOREIGN KEY (`complaintypeID`) REFERENCES `complaintype`(`complaintypeID`) ON DELETE RESTRICT ON UPDATE CASCADE;
