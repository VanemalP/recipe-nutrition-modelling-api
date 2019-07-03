import { CreateSubrecipeDto } from './../models/subrecipes/create-subrecipe.dto';
import { CreateIngredientDto } from './../models/ingredients/create-ingredient.dto';
import { IngredientsService } from './../helpers/ingredients.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Recipe } from './../data/entities/recipe.entity';
import { Repository } from 'typeorm';
import { User } from '../data/entities/user.entity';
import { NutritionService } from '../helpers/nutrition.service';
import { SubrecipeNotFound } from '../common/exeptions/subrecipe-not-found';
import { SubrecipesService } from '../helpers/subrecipes.service';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe) private readonly recipeRepository: Repository<Recipe>,
    private readonly ingredientsService: IngredientsService,
    private readonly nutritionService: NutritionService,
    private readonly subrecipesService: SubrecipesService,
  ) {}

  async createRecipe(ingredientsData: CreateIngredientDto[], subrecipesData: CreateSubrecipeDto[] , title: string, notes: string, imageUrl: string, author: User) {
    const newRecipe = await this.recipeRepository.create();
    newRecipe.title = title;
    if (notes) {
      newRecipe.notes = notes;
    }

    if (imageUrl) {
      newRecipe.imageURL = imageUrl;
    }

    newRecipe.author = Promise.resolve(author);
    newRecipe.derivedRecipes = Promise.resolve([]);
    newRecipe.foodGroups = []; // to change - get ingredients food groups
    const savedRecipe = await this.recipeRepository.save(newRecipe);

    const recipeIngredients = await Promise.all(ingredientsData.map(async (ingredientData) => {
        return await this.ingredientsService.createIngredient(ingredientData, savedRecipe);
    }));

    // const recipeSubrecipes = await Promise.all(subrecipesData.map(async (subrecipeData) => {
    //   const linkedRecipe = await this.getRecipeById(subrecipeData.recipeId);
    //     return await this.subrecipesService.createSubrecipe(subrecipeData, linkedRecipe, savedRecipe);
    // }));

    const ingredientsTotalNutrition = await this.nutritionService.calculateIngredientsTotalNutrition(recipeIngredients);
    // const subrecipesTotalNutrition = await this.nutritionService.calculateSubrecipesTotalNutrition(recipeSubrecipes);
    // const recipeNutrition = await this.nutritionService.createNutrition(ingredientsTotalNutrition, subrecipesTotalNutrition, savedRecipe);
    const recipeNutrition = await this.nutritionService.createNutrition(ingredientsTotalNutrition, undefined, savedRecipe);
    savedRecipe.nutrition = recipeNutrition;
    savedRecipe.amount = ingredientsTotalNutrition.weight;


    return await this.recipeRepository.save(savedRecipe);
  }

  async getRecipeById(id: string) {
    const foundRecipe = await this.recipeRepository.findOne({
      where: {id},
    });

    if (!foundRecipe) {
      throw new SubrecipeNotFound();
    }

    return foundRecipe;
  }
}
