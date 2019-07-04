import {MigrationInterface, QueryRunner} from "typeorm";

export class Initial1562245796936 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `users` (`id` varchar(36) NOT NULL, `username` varchar(255) NOT NULL, `password` varchar(255) NOT NULL, `email` varchar(255) NOT NULL, `firstName` varchar(255) NOT NULL, `lastName` varchar(255) NOT NULL, `joined` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `ingredients` (`id` varchar(36) NOT NULL, `quantity` int NOT NULL DEFAULT 0, `unit` varchar(255) NOT NULL, `isDeleted` tinyint NOT NULL DEFAULT 0, `productCode` int NULL, `recipeId` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `food_groups` (`code` int NOT NULL, `description` varchar(255) NOT NULL, PRIMARY KEY (`code`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `measures` (`id` varchar(36) NOT NULL, `measure` varchar(255) NOT NULL, `amount` int NOT NULL, `gramsPerMeasure` int NOT NULL, `productCode` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `products` (`code` int NOT NULL, `description` varchar(255) NOT NULL, `foodGroupCode` int NULL, `nutritionId` varchar(36) NULL, UNIQUE INDEX `REL_029502bbd9a8edca9ebb9ae652` (`nutritionId`), PRIMARY KEY (`code`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `nutritions` (`id` varchar(36) NOT NULL, `PROCNT` text NOT NULL, `FAT` text NOT NULL, `CHOCDF` text NOT NULL, `ENERC_KCAL` text NOT NULL, `SUGAR` text NOT NULL, `FIBTG` text NOT NULL, `CA` text NOT NULL, `FE` text NOT NULL, `P` text NOT NULL, `K` text NOT NULL, `NA` text NOT NULL, `VITA_IU` text NOT NULL, `TOCPHA` text NOT NULL, `VITD` text NOT NULL, `VITC` text NOT NULL, `VITB12` text NOT NULL, `FOLAC` text NOT NULL, `CHOLE` text NOT NULL, `FATRN` text NOT NULL, `FASAT` text NOT NULL, `FAMS` text NOT NULL, `FAPU` text NOT NULL, `isDeleted` tinyint NOT NULL DEFAULT 0, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `subrecipe` (`id` varchar(36) NOT NULL, `quantity` int NOT NULL DEFAULT 0, `unit` varchar(255) NOT NULL, `isDeleted` tinyint NOT NULL DEFAULT 0, `linkedRecipeId` varchar(36) NULL, `recipeId` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `recipes` (`id` varchar(36) NOT NULL, `title` varchar(255) NOT NULL, `imageURL` varchar(255) NOT NULL DEFAULT 'https://images.all-free-download.com/images/graphiclarge/healthy_meal_background_vegetables_eggs_bacon_icons_6836169.jpg', `notes` longtext NOT NULL DEFAULT '', `measure` varchar(255) NOT NULL DEFAULT 'g', `amount` int NOT NULL DEFAULT 0, `Created` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `isDeleted` tinyint NOT NULL DEFAULT 0, `authorId` varchar(36) NULL, `categoryName` varchar(255) NULL, `nutritionId` varchar(36) NULL, UNIQUE INDEX `REL_642147e73deda7e94f8fa87c5b` (`nutritionId`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `categories` (`name` varchar(255) NOT NULL, PRIMARY KEY (`name`)) ENGINE=InnoDB");
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
        await queryRunner.query("DROP TABLE `categories`");
        await queryRunner.query("DROP INDEX `REL_642147e73deda7e94f8fa87c5b` ON `recipes`");
        await queryRunner.query("DROP TABLE `recipes`");
        await queryRunner.query("DROP TABLE `subrecipe`");
        await queryRunner.query("DROP TABLE `nutritions`");
        await queryRunner.query("DROP INDEX `REL_029502bbd9a8edca9ebb9ae652` ON `products`");
        await queryRunner.query("DROP TABLE `products`");
        await queryRunner.query("DROP TABLE `measures`");
        await queryRunner.query("DROP TABLE `food_groups`");
        await queryRunner.query("DROP TABLE `ingredients`");
        await queryRunner.query("DROP TABLE `users`");
    }

}
