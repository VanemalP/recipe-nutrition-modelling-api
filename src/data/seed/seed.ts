import { Category } from './../entities/categoriy.entity';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as fg from '../USDA_db/fd_group.json';
import * as fd from '../USDA_db/food_des.json';
import * as nd from '../USDA_db/nut_data.json';
import * as ndef from '../USDA_db/nutr_def.json';
import * as w from '../USDA_db/weight.json';
import * as cat from '../USDA_db/categories.json';

import { User } from '../entities/user.entity';
import { Measure } from '../entities/measure.entity';
import { Nutrition } from '../entities/nutrition.entity';
import { Product } from '../entities/product.entity';
import { FoodGroup } from '../entities/food-group.entity';

// Custom async forEach
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

const main = async () => {
  const connection = await createConnection();

  const userRepository = connection.manager.getRepository(User);
  const productRepository = connection.manager.getRepository(Product);
  const measureRepository = connection.manager.getRepository(Measure);
  const nutritionRepository = connection.manager.getRepository(Nutrition);
  const foodGroupRepository = connection.manager.getRepository(FoodGroup);
  const categoryRepository = connection.manager.getRepository(Category);

  const foodGroup = fg;
  const foodDescription = fd;
  const nutrientData = nd as any;
  const nutrientDefinition = ndef;
  const weight = w;
  const category = cat;

  const populateDatabase = async () => {
    await asyncForEach(foodGroup, async (fdGrp) => {
      const foodGrp = new FoodGroup();
      foodGrp.code = fdGrp.FdGrp_Cd;
      foodGrp.description = fdGrp.FdGrp_desc;
      foodGrp.products = Promise.resolve([]);

      await foodGroupRepository.save(foodGrp);
    });

    await asyncForEach(category, async (recipeCat) => {
      const recipeCategory = new Category();
      recipeCategory.name = recipeCat.Name;
      recipeCategory.recipes = Promise.resolve([]);

      await categoryRepository.save(recipeCategory);
    });

    await asyncForEach(foodDescription, async (p) => {
      const product = await productRepository.create();
      product.code = p.NDB_No;
      product.description = p.Long_Desc;

      const productFoodGroup = await foodGroupRepository.findOne({
        where: {
          code: p.FdGrp_Cd,
        },
      });
      product.foodGroup = productFoodGroup;
      await productRepository.save(product);

      const measureInGr = new Measure();
      measureInGr.amount = 1;
      measureInGr.gramsPerMeasure = 1;
      measureInGr.measure = 'g';
      measureInGr.product = Promise.resolve(product);
      await measureRepository.save(measureInGr);

      const measures = weight.filter((wght) => wght.NDB_No === p.NDB_No);

      await asyncForEach(measures, async (m) => {
        const measure = new Measure();
        measure.measure = m.Msre_Desc;
        let amount = m.Amount;
        if (m.Msre_Desc.includes('package') && m.Amount !== '1') {
          amount = 1;
        }
        measure.amount = amount;
        measure.gramsPerMeasure = m.Gm_Wgt;
        measure.product = Promise.resolve(product);
        await measureRepository.save(measure);
      });

      const nutrition = new Nutrition();
      nutrientDefinition.forEach((n) => {
        const code = n.Nutr_no;
        const nutriData = nutrientData.find((nutr) => (+nutr.Nutr_No === code && +nutr.NDB_No === p.NDB_No));
        let value;
        if (nutriData === undefined) {
          value = 0;
        } else {
          value = nutriData.Nutr_Val;
        }

        nutrition[n.Tagname] = {
          description: n.NutrDesc,
          unit: n.Units,
          value,
        };
      });
      nutrition.product = Promise.resolve(product);
      nutrition.recipe = Promise.resolve(null);
      await nutritionRepository.save(nutrition);
    });

    const plamena = await userRepository.findOne({
      where: {
        firstName: 'Plamena',
      },
    });

    if (!plamena) {
      const user = new User();
      user.username = 'anemalP';
      const passwordHash = await bcrypt.hash('An3ma!p', 10);
      user.password = passwordHash;
      user.email = 'pla@pla.pla';
      user.firstName = 'Plamena';
      user.lastName = 'Vladimirova';
      await userRepository.save(user);
    } else {
      console.log(`Plamena is already in the db`);
    }

    const silvia = await userRepository.findOne({
      where: {
        firstName: 'Silvia',
      },
    });

    if (!silvia) {
      const user = new User();
      user.username = 'silv100';
      const passwordHash = await bcrypt.hash('Sto100a@', 10);
      user.password = passwordHash;
      user.email = 'mail@mail.com';
      user.firstName = 'Silvia';
      user.lastName = 'Stoianova';
      await userRepository.save(user);
    } else {
      console.log(`Silvia is already in the db`);
    }

    const testUser = await userRepository.findOne({
      where: {
        firstName: 'Test',
      },
    });

    if (!testUser) {
      const user = new User();
      user.username = 'TestUser';
      const passwordHash = await bcrypt.hash('Test1234%', 10);
      user.password = passwordHash;
      user.email = 'test@test.test';
      user.firstName = 'Test';
      user.lastName = 'User';
      await userRepository.save(user);
    } else {
      console.log(`TestUser is already in the db`);
    }

    connection.close();
  };

  populateDatabase();
};

main().catch(console.error);
