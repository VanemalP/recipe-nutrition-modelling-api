import {MigrationInterface, QueryRunner} from "typeorm";

export class Initial1561884728284 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `users` CHANGE `joined` `joined` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)");
        await queryRunner.query("ALTER TABLE `recipes` DROP FOREIGN KEY `FK_afd4f74f8df44df574253a7f37b`");
        await queryRunner.query("ALTER TABLE `recipes` CHANGE `authorId` `authorId` varchar(36) NULL");
        await queryRunner.query("ALTER TABLE `recipe_products` DROP FOREIGN KEY `FK_b5d5a9de7331142dee95cd684fb`");
        await queryRunner.query("ALTER TABLE `recipe_products` DROP FOREIGN KEY `FK_e30971c79c4c37daf591e443c4f`");
        await queryRunner.query("ALTER TABLE `recipe_products` CHANGE `productCode` `productCode` int NULL");
        await queryRunner.query("ALTER TABLE `recipe_products` CHANGE `recipesId` `recipesId` varchar(36) NULL");
        await queryRunner.query("ALTER TABLE `products` DROP FOREIGN KEY `FK_029502bbd9a8edca9ebb9ae652d`");
        await queryRunner.query("ALTER TABLE `products` CHANGE `nutritionId` `nutritionId` varchar(36) NULL");
        await queryRunner.query("ALTER TABLE `measures` DROP FOREIGN KEY `FK_db5edcd1328fb776774cc41420e`");
        await queryRunner.query("ALTER TABLE `measures` CHANGE `productCode` `productCode` int NULL");
        await queryRunner.query("ALTER TABLE `recipes` ADD CONSTRAINT `FK_afd4f74f8df44df574253a7f37b` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `recipe_products` ADD CONSTRAINT `FK_b5d5a9de7331142dee95cd684fb` FOREIGN KEY (`productCode`) REFERENCES `products`(`code`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `recipe_products` ADD CONSTRAINT `FK_e30971c79c4c37daf591e443c4f` FOREIGN KEY (`recipesId`) REFERENCES `recipes`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `products` ADD CONSTRAINT `FK_029502bbd9a8edca9ebb9ae652d` FOREIGN KEY (`nutritionId`) REFERENCES `nutritions`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `measures` ADD CONSTRAINT `FK_db5edcd1328fb776774cc41420e` FOREIGN KEY (`productCode`) REFERENCES `products`(`code`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `measures` DROP FOREIGN KEY `FK_db5edcd1328fb776774cc41420e`");
        await queryRunner.query("ALTER TABLE `products` DROP FOREIGN KEY `FK_029502bbd9a8edca9ebb9ae652d`");
        await queryRunner.query("ALTER TABLE `recipe_products` DROP FOREIGN KEY `FK_e30971c79c4c37daf591e443c4f`");
        await queryRunner.query("ALTER TABLE `recipe_products` DROP FOREIGN KEY `FK_b5d5a9de7331142dee95cd684fb`");
        await queryRunner.query("ALTER TABLE `recipes` DROP FOREIGN KEY `FK_afd4f74f8df44df574253a7f37b`");
        await queryRunner.query("ALTER TABLE `measures` CHANGE `productCode` `productCode` int NULL DEFAULT 'NULL'");
        await queryRunner.query("ALTER TABLE `measures` ADD CONSTRAINT `FK_db5edcd1328fb776774cc41420e` FOREIGN KEY (`productCode`) REFERENCES `products`(`code`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `products` CHANGE `nutritionId` `nutritionId` varchar(36) NULL DEFAULT 'NULL'");
        await queryRunner.query("ALTER TABLE `products` ADD CONSTRAINT `FK_029502bbd9a8edca9ebb9ae652d` FOREIGN KEY (`nutritionId`) REFERENCES `nutritions`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `recipe_products` CHANGE `recipesId` `recipesId` varchar(36) NULL DEFAULT 'NULL'");
        await queryRunner.query("ALTER TABLE `recipe_products` CHANGE `productCode` `productCode` int NULL DEFAULT 'NULL'");
        await queryRunner.query("ALTER TABLE `recipe_products` ADD CONSTRAINT `FK_e30971c79c4c37daf591e443c4f` FOREIGN KEY (`recipesId`) REFERENCES `recipes`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `recipe_products` ADD CONSTRAINT `FK_b5d5a9de7331142dee95cd684fb` FOREIGN KEY (`productCode`) REFERENCES `products`(`code`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `recipes` CHANGE `authorId` `authorId` varchar(36) NULL DEFAULT 'NULL'");
        await queryRunner.query("ALTER TABLE `recipes` ADD CONSTRAINT `FK_afd4f74f8df44df574253a7f37b` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `users` CHANGE `joined` `joined` datetime(6) NOT NULL DEFAULT 'current_timestamp(6)'");
    }

}
