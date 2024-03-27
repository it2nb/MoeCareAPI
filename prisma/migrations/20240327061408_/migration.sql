-- DropForeignKey
ALTER TABLE `complainer` DROP FOREIGN KEY `complainer_districtID_fkey`;

-- DropForeignKey
ALTER TABLE `complainer` DROP FOREIGN KEY `complainer_provinceID_fkey`;

-- DropForeignKey
ALTER TABLE `complainer` DROP FOREIGN KEY `complainer_subdistrictID_fkey`;

-- AlterTable
ALTER TABLE `complainer` MODIFY `complainerBirthday` DATE NULL,
    MODIFY `complainerIDcard` VARCHAR(13) NULL,
    MODIFY `provinceID` INTEGER NULL,
    MODIFY `districtID` INTEGER NULL,
    MODIFY `subdistrictID` INTEGER NULL,
    MODIFY `postcode` VARCHAR(5) NULL;

-- AddForeignKey
ALTER TABLE `complainer` ADD CONSTRAINT `complainer_provinceID_fkey` FOREIGN KEY (`provinceID`) REFERENCES `province`(`provinceID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `complainer` ADD CONSTRAINT `complainer_districtID_fkey` FOREIGN KEY (`districtID`) REFERENCES `district`(`districtID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `complainer` ADD CONSTRAINT `complainer_subdistrictID_fkey` FOREIGN KEY (`subdistrictID`) REFERENCES `subdistrict`(`subdistrictID`) ON DELETE SET NULL ON UPDATE CASCADE;
