/*
  Warnings:

  - The primary key for the `district` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `district` DROP PRIMARY KEY,
    ADD PRIMARY KEY (`districtID`);

-- CreateTable
CREATE TABLE `complain` (
    `complainID` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `complainType` VARCHAR(20) NOT NULL,
    `complainTitle` VARCHAR(100) NOT NULL,
    `complainDetail` VARCHAR(191) NULL,
    `complainDate` DATETIME NOT NULL,
    `complainStatus` VARCHAR(20) NOT NULL,
    `orgID` BIGINT UNSIGNED NULL,
    `schoolID` BIGINT UNSIGNED NULL,
    `complainerID` BIGINT UNSIGNED NOT NULL,

    PRIMARY KEY (`complainID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `complain` ADD CONSTRAINT `complain_complainerID_fkey` FOREIGN KEY (`complainerID`) REFERENCES `complainer`(`complainerID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `complainer` ADD CONSTRAINT `complainer_provinceID_fkey` FOREIGN KEY (`provinceID`) REFERENCES `province`(`provinceID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `complainer` ADD CONSTRAINT `complainer_districtID_fkey` FOREIGN KEY (`districtID`) REFERENCES `district`(`districtID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `complainer` ADD CONSTRAINT `complainer_subdistrictID_fkey` FOREIGN KEY (`subdistrictID`) REFERENCES `subdistrict`(`subdistrictID`) ON DELETE RESTRICT ON UPDATE CASCADE;
