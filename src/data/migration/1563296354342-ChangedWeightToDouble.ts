import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangedWeightToDouble1563296354342 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `recipes` DROP COLUMN `Created`");
        await queryRunner.query("ALTER TABLE `recipes` ADD `created` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)");
        await queryRunner.query("ALTER TABLE `users` CHANGE `joined` `joined` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)");
        await queryRunner.query("ALTER TABLE `ingredients` DROP FOREIGN KEY `FK_62805edc6999810ca7df35cc5ad`");
        await queryRunner.query("ALTER TABLE `ingredients` DROP FOREIGN KEY `FK_f20a9542c7a02105fa40a08d95b`");
        await queryRunner.query("ALTER TABLE `ingredients` DROP COLUMN `quantity`");
        await queryRunner.query("ALTER TABLE `ingredients` ADD `quantity` double NOT NULL DEFAULT 0");
        await queryRunner.query("ALTER TABLE `ingredients` CHANGE `productCode` `productCode` int NULL");
        await queryRunner.query("ALTER TABLE `ingredients` CHANGE `recipeId` `recipeId` varchar(36) NULL");
        await queryRunner.query("ALTER TABLE `measures` DROP FOREIGN KEY `FK_db5edcd1328fb776774cc41420e`");
        await queryRunner.query("ALTER TABLE `measures` CHANGE `productCode` `productCode` int NULL");
        await queryRunner.query("ALTER TABLE `products` DROP FOREIGN KEY `FK_8e69e50882e0659071cbb19a907`");
        await queryRunner.query("ALTER TABLE `products` DROP FOREIGN KEY `FK_029502bbd9a8edca9ebb9ae652d`");
        await queryRunner.query("ALTER TABLE `products` CHANGE `foodGroupCode` `foodGroupCode` int NULL");
        await queryRunner.query("ALTER TABLE `products` CHANGE `nutritionId` `nutritionId` varchar(36) NULL");
        await queryRunner.query("ALTER TABLE `subrecipe` DROP FOREIGN KEY `FK_5c98abc5d084d66e90ffafd5903`");
        await queryRunner.query("ALTER TABLE `subrecipe` DROP FOREIGN KEY `FK_339f7b57de5e78d5f996bf861d7`");
        await queryRunner.query("ALTER TABLE `subrecipe` DROP COLUMN `quantity`");
        await queryRunner.query("ALTER TABLE `subrecipe` ADD `quantity` double NOT NULL DEFAULT 0");
        await queryRunner.query("ALTER TABLE `subrecipe` CHANGE `linkedRecipeId` `linkedRecipeId` varchar(36) NULL");
        await queryRunner.query("ALTER TABLE `subrecipe` CHANGE `recipeId` `recipeId` varchar(36) NULL");
        await queryRunner.query("ALTER TABLE `recipes` DROP FOREIGN KEY `FK_afd4f74f8df44df574253a7f37b`");
        await queryRunner.query("ALTER TABLE `recipes` DROP FOREIGN KEY `FK_c5607535ef86a119666d02dc510`");
        await queryRunner.query("ALTER TABLE `recipes` DROP FOREIGN KEY `FK_642147e73deda7e94f8fa87c5bf`");
        await queryRunner.query("ALTER TABLE `recipes` CHANGE `measure` `measure` varchar(255) NOT NULL DEFAULT '1 g'");
        await queryRunner.query("ALTER TABLE `recipes` DROP COLUMN `amount`");
        await queryRunner.query("ALTER TABLE `recipes` ADD `amount` double NOT NULL DEFAULT 0");
        await queryRunner.query("ALTER TABLE `recipes` CHANGE `authorId` `authorId` varchar(36) NULL");
        await queryRunner.query("ALTER TABLE `recipes` CHANGE `categoryName` `categoryName` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `recipes` CHANGE `nutritionId` `nutritionId` varchar(36) NULL");
        await queryRunner.query("ALTER TABLE `ingredients` ADD CONSTRAINT `FK_62805edc6999810ca7df35cc5ad` FOREIGN KEY (`productCode`) REFERENCES `products`(`code`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `ingredients` ADD CONSTRAINT `FK_f20a9542c7a02105fa40a08d95b` FOREIGN KEY (`recipeId`) REFERENCES `recipes`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `measures` ADD CONSTRAINT `FK_db5edcd1328fb776774cc41420e` FOREIGN KEY (`productCode`) REFERENCES `products`(`code`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `products` ADD CONSTRAINT `FK_8e69e50882e0659071cbb19a907` FOREIGN KEY (`foodGroupCode`) REFERENCES `food_groups`(`code`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `products` ADD CONSTRAINT `FK_029502bbd9a8edca9ebb9ae652d` FOREIGN KEY (`nutritionId`) REFERENCES `nutritions`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `subrecipe` ADD CONSTRAINT `FK_5c98abc5d084d66e90ffafd5903` FOREIGN KEY (`linkedRecipeId`) REFERENCES `recipes`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `subrecipe` ADD CONSTRAINT `FK_339f7b57de5e78d5f996bf861d7` FOREIGN KEY (`recipeId`) REFERENCES `recipes`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `recipes` ADD CONSTRAINT `FK_afd4f74f8df44df574253a7f37b` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `recipes` ADD CONSTRAINT `FK_c5607535ef86a119666d02dc510` FOREIGN KEY (`categoryName`) REFERENCES `categories`(`name`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `recipes` ADD CONSTRAINT `FK_642147e73deda7e94f8fa87c5bf` FOREIGN KEY (`nutritionId`) REFERENCES `nutritions`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `recipes` DROP FOREIGN KEY `FK_642147e73deda7e94f8fa87c5bf`");
        await queryRunner.query("ALTER TABLE `recipes` DROP FOREIGN KEY `FK_c5607535ef86a119666d02dc510`");
        await queryRunner.query("ALTER TABLE `recipes` DROP FOREIGN KEY `FK_afd4f74f8df44df574253a7f37b`");
        await queryRunner.query("ALTER TABLE `subrecipe` DROP FOREIGN KEY `FK_339f7b57de5e78d5f996bf861d7`");
        await queryRunner.query("ALTER TABLE `subrecipe` DROP FOREIGN KEY `FK_5c98abc5d084d66e90ffafd5903`");
        await queryRunner.query("ALTER TABLE `products` DROP FOREIGN KEY `FK_029502bbd9a8edca9ebb9ae652d`");
        await queryRunner.query("ALTER TABLE `products` DROP FOREIGN KEY `FK_8e69e50882e0659071cbb19a907`");
        await queryRunner.query("ALTER TABLE `measures` DROP FOREIGN KEY `FK_db5edcd1328fb776774cc41420e`");
        await queryRunner.query("ALTER TABLE `ingredients` DROP FOREIGN KEY `FK_f20a9542c7a02105fa40a08d95b`");
        await queryRunner.query("ALTER TABLE `ingredients` DROP FOREIGN KEY `FK_62805edc6999810ca7df35cc5ad`");
        await queryRunner.query("ALTER TABLE `recipes` CHANGE `nutritionId` `nutritionId` varchar(36) NULL DEFAULT 'NULL'");
        await queryRunner.query("ALTER TABLE `recipes` CHANGE `categoryName` `categoryName` varchar(255) NULL DEFAULT 'NULL'");
        await queryRunner.query("ALTER TABLE `recipes` CHANGE `authorId` `authorId` varchar(36) NULL DEFAULT 'NULL'");
        await queryRunner.query("ALTER TABLE `recipes` DROP COLUMN `amount`");
        await queryRunner.query("ALTER TABLE `recipes` ADD `amount` int NOT NULL DEFAULT '0'");
        await queryRunner.query("ALTER TABLE `recipes` CHANGE `measure` `measure` varchar(255) NOT NULL DEFAULT ''g''");
        await queryRunner.query("ALTER TABLE `recipes` ADD CONSTRAINT `FK_642147e73deda7e94f8fa87c5bf` FOREIGN KEY (`nutritionId`) REFERENCES `nutritions`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `recipes` ADD CONSTRAINT `FK_c5607535ef86a119666d02dc510` FOREIGN KEY (`categoryName`) REFERENCES `categories`(`name`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `recipes` ADD CONSTRAINT `FK_afd4f74f8df44df574253a7f37b` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `subrecipe` CHANGE `recipeId` `recipeId` varchar(36) NULL DEFAULT 'NULL'");
        await queryRunner.query("ALTER TABLE `subrecipe` CHANGE `linkedRecipeId` `linkedRecipeId` varchar(36) NULL DEFAULT 'NULL'");
        await queryRunner.query("ALTER TABLE `subrecipe` DROP COLUMN `quantity`");
        await queryRunner.query("ALTER TABLE `subrecipe` ADD `quantity` int NOT NULL DEFAULT '0'");
        await queryRunner.query("ALTER TABLE `subrecipe` ADD CONSTRAINT `FK_339f7b57de5e78d5f996bf861d7` FOREIGN KEY (`recipeId`) REFERENCES `recipes`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `subrecipe` ADD CONSTRAINT `FK_5c98abc5d084d66e90ffafd5903` FOREIGN KEY (`linkedRecipeId`) REFERENCES `recipes`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `products` CHANGE `nutritionId` `nutritionId` varchar(36) NULL DEFAULT 'NULL'");
        await queryRunner.query("ALTER TABLE `products` CHANGE `foodGroupCode` `foodGroupCode` int NULL DEFAULT 'NULL'");
        await queryRunner.query("ALTER TABLE `products` ADD CONSTRAINT `FK_029502bbd9a8edca9ebb9ae652d` FOREIGN KEY (`nutritionId`) REFERENCES `nutritions`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `products` ADD CONSTRAINT `FK_8e69e50882e0659071cbb19a907` FOREIGN KEY (`foodGroupCode`) REFERENCES `food_groups`(`code`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `measures` CHANGE `productCode` `productCode` int NULL DEFAULT 'NULL'");
        await queryRunner.query("ALTER TABLE `measures` ADD CONSTRAINT `FK_db5edcd1328fb776774cc41420e` FOREIGN KEY (`productCode`) REFERENCES `products`(`code`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `ingredients` CHANGE `recipeId` `recipeId` varchar(36) NULL DEFAULT 'NULL'");
        await queryRunner.query("ALTER TABLE `ingredients` CHANGE `productCode` `productCode` int NULL DEFAULT 'NULL'");
        await queryRunner.query("ALTER TABLE `ingredients` DROP COLUMN `quantity`");
        await queryRunner.query("ALTER TABLE `ingredients` ADD `quantity` int NOT NULL DEFAULT '0'");
        await queryRunner.query("ALTER TABLE `ingredients` ADD CONSTRAINT `FK_f20a9542c7a02105fa40a08d95b` FOREIGN KEY (`recipeId`) REFERENCES `recipes`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `ingredients` ADD CONSTRAINT `FK_62805edc6999810ca7df35cc5ad` FOREIGN KEY (`productCode`) REFERENCES `products`(`code`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `users` CHANGE `joined` `joined` datetime(6) NOT NULL DEFAULT 'current_timestamp(6)'");
        await queryRunner.query("ALTER TABLE `recipes` DROP COLUMN `created`");
        await queryRunner.query("ALTER TABLE `recipes` ADD `Created` datetime(6) NOT NULL DEFAULT 'current_timestamp(6)'");
    }

}
