/*
  Warnings:

  - The primary key for the `caseagency` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `caseagnecyDate` on the `caseagency` table. All the data in the column will be lost.
  - Added the required column `caseagencyDate` to the `caseagency` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `caseagency` DROP PRIMARY KEY,
    DROP COLUMN `caseagnecyDate`,
    ADD COLUMN `caseagencyDate` DATETIME(0) NOT NULL,
    ADD PRIMARY KEY (`complainID`, `caseagencyDate`);
