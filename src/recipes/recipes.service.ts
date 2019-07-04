import { Ingredient } from './../data/entities/ingredient.entity';
import { Subrecipe } from './../data/entities/subrecipe.entity';
import { CreateSubrecipeDto } from './../models/subrecipes/create-subrecipe.dto';
import { CreateIngredientDto } from './../models/ingredients/create-ingredient.dto';
import { IngredientsService } from './../helpers/ingredients.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Recipe } from './../data/entities/recipe.entity';
import { Repository } from 'typeorm';
import { User } from '../data/entities/user.entity';
import { NutritionService } from '../helpers/nutrition.service';
import { RecipeNotFound } from '../common/exeptions/recipe-not-found';
import { SubrecipesService } from '../helpers/subrecipes.service';
import { ITotalNutrition } from '../common/interfaces/total-nutrition';
import { NutrientsEnum } from '../common/enums/nutrients.enum';
import { RecipeBadRequest } from '../common/exeptions/recipe-bad-request';
import { CategoriesService } from '../helpers/categories.service';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe) private readonly recipeRepository: Repository<Recipe>,
    private readonly ingredientsService: IngredientsService,
    private readonly nutritionService: NutritionService,
    private readonly subrecipesService: SubrecipesService,
    private readonly categoriesService: CategoriesService,
  ) {}

  async createRecipe(ingredientsData: CreateIngredientDto[], subrecipesData: CreateSubrecipeDto[], title: string, category: string, notes: string, imageUrl: string, author: User) {
    const newRecipe = await this.recipeRepository.create();
    newRecipe.title = title;
    const recipeCategory = await this.categoriesService.getCategoryByName(category);
    newRecipe.category = recipeCategory;
    if (notes) {
      newRecipe.notes = notes;
    }
    if (imageUrl) {
      newRecipe.imageURL = imageUrl;
    }
    newRecipe.author = Promise.resolve(author);
    newRecipe.derivedRecipes = Promise.resolve([]);

    const savedRecipe = await this.recipeRepository.save(newRecipe);
    const allNutrientsArr: ITotalNutrition[] = [];

    let ingredientsTotalNutrition: ITotalNutrition;
    let subrecipesTotalNutrition: ITotalNutrition;

    if (ingredientsData) {
      const recipeIngredients = await Promise.all(ingredientsData.map(async (ingredientData) => {
        return await this.ingredientsService.createIngredient(ingredientData, savedRecipe);
      }));
      ingredientsTotalNutrition = await this.nutritionService.calculateIngredientsTotalNutrition(recipeIngredients);
      allNutrientsArr.push(ingredientsTotalNutrition);
    }

    if (subrecipesData) {
      const recipeSubrecipes = await Promise.all(subrecipesData.map(async (subrecipeData) => {
        const linkedRecipe = await this.getRecipeById(subrecipeData.recipeId);
        return await this.subrecipesService.createSubrecipe(subrecipeData, linkedRecipe, savedRecipe);
      }));
      subrecipesTotalNutrition = await this.nutritionService.calculateSubrecipesTotalNutrition(recipeSubrecipes);
      allNutrientsArr.push(subrecipesTotalNutrition);
    }

    const allNutrients = allNutrientsArr.reduce((acc, curr) => {
      const nutrientNames = Object.keys(curr.nutrients);
      nutrientNames.forEach((nutrientName: NutrientsEnum) => {
        acc.nutrients[nutrientName].value += curr.nutrients[nutrientName].value;
      });
      acc.weight += curr.weight;
      return acc;
    });

    const recipeNutrition = await this.nutritionService.createNutrition(allNutrients);
    savedRecipe.nutrition = recipeNutrition;
    savedRecipe.amount = allNutrients.weight;

    return await this.recipeRepository.save(savedRecipe);
  }

  async getRecipeById(id: string) {
    const foundRecipe = await this.recipeRepository.findOne({
      where: {
        id,
        isDeleted: false,
      },
    });

    if (!foundRecipe) {
      throw new RecipeNotFound('Recipe not found');
    }
    return foundRecipe;
  }

  async deleteRecipeById(id: string): Promise<{ message: string }> {
    const deleteRecipe = async () => {
      const recipeToDelete = await this.recipeRepository.findOne({
        where: {id},
      });

      if (!recipeToDelete) {
        throw new RecipeNotFound('Recipe not found');
      }

      const derivedRecipes = await recipeToDelete.derivedRecipes;
      if (derivedRecipes.length > 0) {
        const hasUndeltedRecipe = derivedRecipes.some((recipe) => recipe.isDeleted === false);
        if (hasUndeltedRecipe) {
          throw new RecipeBadRequest('This recipe is used in other recipe/s and can not be deleted');
        }
      }

      const ingredients = recipeToDelete.ingredients;
      if (ingredients.length > 0) {
        await this.asyncForEach(ingredients, async (ingredient: Ingredient) => {
          await this.ingredientsService.deleteIngredientByRecipeId(ingredient.id);
        });
      }

      const subrecipes = recipeToDelete.subrecipes;
      if (subrecipes.length > 0) {
        await this.asyncForEach(subrecipes, async (subrecipe: Subrecipe) => {
          await this.subrecipesService.deleteSubrecipe(subrecipe.id);
        });
      }

      const nutrition = recipeToDelete.nutrition;
      await this.nutritionService.deleteNutrition(nutrition.id);

      recipeToDelete.isDeleted = true;

      await this.recipeRepository.save(recipeToDelete);
    };

    deleteRecipe();
    return { message: 'Recipe successfully deleted' };
  }

  // Custom async forEach
  async asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }
}
