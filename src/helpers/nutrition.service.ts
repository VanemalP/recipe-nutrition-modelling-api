import { ITotalNutrition } from './../common/interfaces/total-nutrition';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Ingredient } from '../data/entities/ingredient.entity';
import { NutrientsEnum } from '../common/enums/nutrients.enum';
import { Nutrition } from '../data/entities/nutrition.entity';
import { Subrecipe } from '../data/entities/subrecipe.entity';
import { NutritionNotFound } from '../common/exeptions/nutrition-not-found';
import { Recipe } from '../data/entities/recipe.entity';

@Injectable()
export class NutritionService {
  constructor(@InjectRepository(Nutrition) private readonly nutritionRepository: Repository<Nutrition>) {}

  async createNutrition(allNutrients: ITotalNutrition): Promise<Nutrition> {
    const nutrientNames = Object.keys(allNutrients.nutrients);
    nutrientNames.forEach((nutrientName: NutrientsEnum) => {
      const nutrValue = allNutrients.nutrients[nutrientName].value / allNutrients.weight * 100;
      allNutrients.nutrients[nutrientName].value = +nutrValue.toFixed(3);
    });
    const nutrition = await this.nutritionRepository.create({
      product: null,
      ...allNutrients.nutrients,
    });

    const recipeNutrition = await this.nutritionRepository.save(nutrition);

    return recipeNutrition;
  }

  calculateIngredientsTotalNutrition(ingredients: Ingredient[]): ITotalNutrition {
    const calculatedNutrients = ingredients.map(ingredient => {
      if (!ingredient.isDeleted) {
        const measureOfIngredient = ingredient.product.measures.find(
          measure => `${measure.amount.toString()} ${measure.measure}` === ingredient.unit,
        );
        const weightInGrams = measureOfIngredient.gramsPerMeasure * ingredient.quantity;
        const nutrients = this.getNutrients(ingredient.product.nutrition, weightInGrams);

        return {nutrients, weight: weightInGrams};
      }
    }).filter((item) => item !== undefined);

    if (calculatedNutrients.length > 0) {
      const nutrs = calculatedNutrients.reduce((acc, curr) => {
        const nutrientNames = Object.keys(curr.nutrients);
        nutrientNames.forEach((nutrientName: NutrientsEnum) => {
          acc.nutrients[nutrientName].value += curr.nutrients[nutrientName].value;
        });
        acc.weight += curr.weight;

        return acc;
      });

      return nutrs;
    }
  }

  async calculateSubrecipesTotalNutrition(data: Array<{subrecipe: Subrecipe, linkedRecipe: Recipe}>): Promise<ITotalNutrition> {
    const calculatedNutrients = await Promise.all(data.map(async (subrecipe) => {
      if (!subrecipe.subrecipe.isDeleted) {
        const weightInGrams = subrecipe.linkedRecipe.amount * subrecipe.subrecipe.quantity;
        const nutrients = this.getNutrients(subrecipe.linkedRecipe.nutrition, weightInGrams);

        return {nutrients, weight: weightInGrams};
      }
    })).then(result => result.filter(item => item !== undefined));

    if (calculatedNutrients.length > 0) {
      const nutrs = calculatedNutrients.reduce((acc, curr) => {
        const nutrientNames = Object.keys(curr.nutrients);
        nutrientNames.forEach((nutrientName: NutrientsEnum) => {
          acc.nutrients[nutrientName].value += curr.nutrients[nutrientName].value;
        });
        acc.weight += curr.weight;

        return acc;
      });

      return nutrs;
    }
  }

  async updateNutrition(nutrition: Nutrition, allNutrients: ITotalNutrition): Promise<Nutrition> {
    const nutrientNames = Object.keys(allNutrients.nutrients);
    nutrientNames.forEach((nutrientName: NutrientsEnum) => {
      const nutrValue = allNutrients.nutrients[nutrientName].value / allNutrients.weight * 100;
      nutrition[nutrientName].value = +nutrValue.toFixed(3);
    });

    return await this.nutritionRepository.save(nutrition);
  }

  async deleteNutrition(id: string) {
    const nutritionToDelete = await this.nutritionRepository.findOne({
      where: {
        id,
      },
    });

    if (!nutritionToDelete) {
      throw new NutritionNotFound('Nutrition does not exist');
    }

    nutritionToDelete.isDeleted = true;

    return await this.nutritionRepository.save(nutritionToDelete);
  }

  async findNutritionById(id: string): Promise<Nutrition> {
    const foundNutrition = await this.nutritionRepository.findOne({
      where: {
        id,
        isDeleted: false,
      },
    });
    if (!foundNutrition) {
      throw new NutritionNotFound('No such nutrition');
    }

    return foundNutrition;
  }

  private getNutrients(itemNutrition: Nutrition, weightInGrams: number) {
    const nutrients = {
      PROCNT: itemNutrition.PROCNT,
      FAT: itemNutrition.FAT,
      CHOCDF: itemNutrition.CHOCDF,
      ENERC_KCAL: itemNutrition.ENERC_KCAL,
      SUGAR: itemNutrition.SUGAR,
      FIBTG: itemNutrition.FIBTG,
      CA: itemNutrition.CA,
      FE: itemNutrition.FE,
      P: itemNutrition.P,
      K: itemNutrition.K,
      NA: itemNutrition.NA,
      VITA_IU: itemNutrition.VITA_IU,
      TOCPHA: itemNutrition.TOCPHA,
      VITD: itemNutrition.VITD,
      VITC: itemNutrition.VITC,
      VITB12: itemNutrition.VITB12,
      FOLAC: itemNutrition.FOLAC,
      CHOLE: itemNutrition.CHOLE,
      FATRN: itemNutrition.FATRN,
      FASAT: itemNutrition.FASAT,
      FAMS: itemNutrition.FAMS,
      FAPU: itemNutrition.FAPU,
    };

    const nutrientNames = Object.keys(nutrients);
    nutrientNames.forEach((nutrientName: NutrientsEnum) => {
      nutrients[nutrientName].value =
      nutrients[nutrientName].value / 100 * weightInGrams;
    });

    return nutrients;
  }
}
