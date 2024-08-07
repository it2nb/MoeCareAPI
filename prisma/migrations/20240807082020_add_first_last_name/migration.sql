/*
  Warnings:

  - Added the required column `userFirstName` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userLastName` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `userFirstName` VARCHAR(50) NOT NULL,
    ADD COLUMN `userLastName` VARCHAR(50) NOT NULL;
