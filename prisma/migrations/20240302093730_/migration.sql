/*
  Warnings:

  - You are about to alter the column `complainDate` on the `complain` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `complain` MODIFY `complainDate` DATETIME NOT NULL;

-- CreateTable
CREATE TABLE `caseagency` (
    `complainID` BIGINT UNSIGNED NOT NULL,
    `caseagencyNum` INTEGER UNSIGNED NOT NULL,
    `agencyID` INTEGER UNSIGNED NOT NULL,
    `caseagencyStatus` VARCHAR(20) NOT NULL,
    `caseagnecyDetail` VARCHAR(191) NULL,
    `casetoagencyID` INTEGER UNSIGNED NULL,
    `caseagnecyDate` DATETIME NOT NULL,
    `caseagencyUpdate` DATETIME NOT NULL,

    PRIMARY KEY (`complainID`, `caseagencyNum`, `agencyID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `school` (
    `schoolID` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `schoolCode` VARCHAR(20) NOT NULL,
    `schoolType` VARCHAR(50) NOT NULL,
    `schoolName` VARCHAR(150) NOT NULL,
    `schoolAddress` VARCHAR(191) NOT NULL,
    `provinceID` INTEGER NOT NULL,
    `districtID` INTEGER NOT NULL,
    `subdistrictID` INTEGER NOT NULL,

    UNIQUE INDEX `school_schoolCode_key`(`schoolCode`),
    PRIMARY KEY (`schoolID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `caseagency` ADD CONSTRAINT `caseagency_complainID_fkey` FOREIGN KEY (`complainID`) REFERENCES `complain`(`complainID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `caseagency` ADD CONSTRAINT `caseagency_agencyID_fkey` FOREIGN KEY (`agencyID`) REFERENCES `agency`(`agencyID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `caseagency` ADD CONSTRAINT `caseagency_casetoagencyID_fkey` FOREIGN KEY (`casetoagencyID`) REFERENCES `agency`(`agencyID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `school` ADD CONSTRAINT `school_provinceID_fkey` FOREIGN KEY (`provinceID`) REFERENCES `province`(`provinceID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `school` ADD CONSTRAINT `school_districtID_fkey` FOREIGN KEY (`districtID`) REFERENCES `district`(`districtID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `school` ADD CONSTRAINT `school_subdistrictID_fkey` FOREIGN KEY (`subdistrictID`) REFERENCES `subdistrict`(`subdistrictID`) ON DELETE RESTRICT ON UPDATE CASCADE;
