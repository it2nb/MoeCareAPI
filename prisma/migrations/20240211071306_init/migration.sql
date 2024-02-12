-- CreateTable
CREATE TABLE `users` (
    `userID` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `userName` VARCHAR(50) NOT NULL,
    `userPassword` VARCHAR(50) NOT NULL,
    `userStatus` VARCHAR(20) NOT NULL,
    `agencyID` INTEGER UNSIGNED NULL,

    PRIMARY KEY (`userID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `agency` (
    `agencyID` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `agencyName` VARCHAR(100) NOT NULL,
    `agencyCode` VARCHAR(20) NOT NULL,

    UNIQUE INDEX `agency_agencyCode_key`(`agencyCode`),
    PRIMARY KEY (`agencyID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
