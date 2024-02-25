/*
  Warnings:

  - You are about to alter the column `complainerCreated` on the `complainer` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `complainerUpdated` on the `complainer` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `complainer` MODIFY `complainerCreated` DATETIME NOT NULL,
    MODIFY `complainerUpdated` DATETIME NULL;
