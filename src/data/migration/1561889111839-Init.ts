import {MigrationInterface, QueryRunner} from 'typeorm';

export class Init1561889111839 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `users` (`id` varchar(36) NOT NULL, `username` varchar(255) NOT NULL, `password` varchar(255) NOT NULL, `email` varchar(255) NOT NULL, `firstName` varchar(255) NOT NULL, `lastName` varchar(255) NOT NULL, `joined` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `nutritions` (`id` varchar(36) NOT NULL, `PROCNT` text NOT NULL, `FAT` text NOT NULL, `CHOCDF` text NOT NULL, `ENERC_KCAL` text NOT NULL, `SUGAR` text NOT NULL, `FIBTG` text NOT NULL, `CA` text NOT NULL, `FE` text NOT NULL, `P` text NOT NULL, `K` text NOT NULL, `NA` text NOT NULL, `VITA_IU` text NOT NULL, `TOCPHA` text NOT NULL, `VITD` text NOT NULL, `VITC` text NOT NULL, `VITB12` text NOT NULL, `FOLAC` text NOT NULL, `CHOLE` text NOT NULL, `FATRN` text NOT NULL, `FASAT` text NOT NULL, `FAMS` text NOT NULL, `FAPU` text NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `recipes` (`id` varchar(36) NOT NULL, `title` varchar(255) NOT NULL, `foodGroup` varchar(255) NOT NULL, `authorId` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `recipe_products` (`id` varchar(36) NOT NULL, `amount` int NOT NULL DEFAULT 0, `productCode` int NULL, `recipesId` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `products` (`code` int NOT NULL, `description` varchar(255) NOT NULL, `foodGroup` varchar(255) NOT NULL, `nutritionId` varchar(36) NULL, UNIQUE INDEX `REL_029502bbd9a8edca9ebb9ae652` (`nutritionId`), PRIMARY KEY (`code`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `measures` (`id` varchar(36) NOT NULL, `measure` varchar(255) NOT NULL, `gramsPerMeasure` int NOT NULL, `productCode` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
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
        await queryRunner.query("DROP TABLE `measures`");
        await queryRunner.query("DROP INDEX `REL_029502bbd9a8edca9ebb9ae652` ON `products`");
        await queryRunner.query("DROP TABLE `products`");
        await queryRunner.query("DROP TABLE `recipe_products`");
        await queryRunner.query("DROP TABLE `recipes`");
        await queryRunner.query("DROP TABLE `nutritions`");
        await queryRunner.query("DROP TABLE `users`");
    }

}
