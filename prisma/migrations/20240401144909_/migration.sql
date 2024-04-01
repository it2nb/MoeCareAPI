-- AlterTable
ALTER TABLE `caseagency` ADD COLUMN `complainerID` BIGINT UNSIGNED NULL,
    ADD COLUMN `userID` INTEGER UNSIGNED NULL;

-- AddForeignKey
ALTER TABLE `caseagency` ADD CONSTRAINT `caseagency_complainerID_fkey` FOREIGN KEY (`complainerID`) REFERENCES `complainer`(`complainerID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `caseagency` ADD CONSTRAINT `caseagency_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `users`(`userID`) ON DELETE SET NULL ON UPDATE CASCADE;
