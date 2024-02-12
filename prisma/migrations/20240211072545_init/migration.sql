-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_agencyID_fkey` FOREIGN KEY (`agencyID`) REFERENCES `agency`(`agencyID`) ON DELETE SET NULL ON UPDATE CASCADE;
