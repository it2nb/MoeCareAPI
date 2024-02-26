/*
  Warnings:

  - You are about to alter the column `provinceID` on the `complainer` table. The data in that column could be lost. The data in that column will be cast from `VarChar(3)` to `Int`.
  - You are about to alter the column `districtID` on the `complainer` table. The data in that column could be lost. The data in that column will be cast from `VarChar(5)` to `Int`.
  - You are about to alter the column `subdistrictID` on the `complainer` table. The data in that column could be lost. The data in that column will be cast from `VarChar(7)` to `Int`.

*/
-- AlterTable
ALTER TABLE `complainer` MODIFY `provinceID` INTEGER NOT NULL,
    MODIFY `districtID` INTEGER NOT NULL,
    MODIFY `subdistrictID` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `district` (
    `districtID` INTEGER NOT NULL DEFAULT 0,
    `districtName` VARCHAR(100) NOT NULL,
    `provinceID` INTEGER NOT NULL DEFAULT 0,

    INDEX `prefecture_ID`(`districtID`, `provinceID`),
    PRIMARY KEY (`districtID`, `provinceID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `province` (
    `provinceNo` INTEGER NOT NULL DEFAULT 0,
    `provinceID` INTEGER NOT NULL DEFAULT 0,
    `provinceName` VARCHAR(100) NOT NULL,
    `regionID` INTEGER NOT NULL DEFAULT 0,
    `regiongroupID` INTEGER NOT NULL,

    INDEX `province_no`(`provinceNo`, `provinceID`, `regionID`),
    PRIMARY KEY (`provinceID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subdistrict` (
    `subdistrictID` INTEGER NOT NULL DEFAULT 0,
    `subdistrictName` VARCHAR(100) NOT NULL,
    `post` INTEGER NOT NULL DEFAULT 0,
    `districtID` INTEGER NOT NULL DEFAULT 0,

    INDEX `district_ID`(`subdistrictID`, `districtID`),
    INDEX `prefectur_id`(`districtID`),
    PRIMARY KEY (`subdistrictID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
