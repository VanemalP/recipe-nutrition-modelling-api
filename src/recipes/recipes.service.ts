import { CreateIngredientDto } from './../models/ingredients/create-ingredient.dto';
import { IngredientsService } from './../helpers/ingredients.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Recipe } from './../data/entities/recipe.entity';
import { Repository } from 'typeorm';
import { User } from '../data/entities/user.entity';
import { NutritionService } from '../helpers/nutrition.service';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe) private readonly recipeRepository: Repository<Recipe>,
    private readonly ingredientsService: IngredientsService,
    private readonly nutritionService: NutritionService,
  ) {}

  async createRecipe(ingredientsData: CreateIngredientDto[], title: string, notes: string, imageUrl: string, author: User) {
    console.log(author);
    const newRecipe = await this.recipeRepository.create();
    newRecipe.title = title;
    newRecipe.notes = notes;
    newRecipe.imageURL = imageUrl;
    newRecipe.author = Promise.resolve(author);
    newRecipe.derivedRecipes = Promise.resolve([]);
    newRecipe.foodGroups = []; // to change - get ingredients food groups
    newRecipe.subrecipes = Promise.resolve([]); // to remove when adding subrecipes
    newRecipe.amount = 0;
    const savedRecipe = await this.recipeRepository.save(newRecipe);
    
    const recipeIngredients = await Promise.all(ingredientsData.map(async (ingredientData) => {
      return await this.ingredientsService.createIngredient(ingredientData, savedRecipe);
    }));
    // newRecipe.ingredients = recipeIngredients;

    const ingredientsTotalNutrition = await this.nutritionService.calculateIngredientsTotalNutrition(recipeIngredients);
    const recipeNutrition = await this.nutritionService.createNutrition(ingredientsTotalNutrition.nutrients, ingredientsTotalNutrition.weight, savedRecipe);
    savedRecipe.nutrition = recipeNutrition;
    savedRecipe.amount = ingredientsTotalNutrition.weight;


    return await this.recipeRepository.save(savedRecipe);
  }
}
