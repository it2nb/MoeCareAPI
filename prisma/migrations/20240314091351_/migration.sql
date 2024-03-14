-- AlterTable
ALTER TABLE `caseagency` MODIFY `caseagnecyDetail` TEXT NULL;

-- AlterTable
ALTER TABLE `complain` ADD COLUMN `complainImages` TEXT NULL,
    MODIFY `complainDetail` TEXT NULL;

-- AlterTable
ALTER TABLE `school` MODIFY `schoolAddress` TEXT NOT NULL;
