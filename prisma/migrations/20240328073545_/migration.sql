/*
  Warnings:

  - Added the required column `userType` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `userType` VARCHAR(20) NOT NULL;
