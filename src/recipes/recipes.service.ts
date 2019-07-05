import { RecipeQueryDto } from './../models/recipes/recipe-query.dto';
import { CreateRecipeDto } from './../models/recipes/create-recipe.dto';
import { BadRequestException } from './../common/exeptions/bad-request';
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
import { UpdateIngredientDto } from '../models/ingredients/update-ingredient.dto';
import { UpdateSubrecipeDto } from '../models/subrecipes/update-subrecipe.dto';
import { UpdateRecipeDto } from '../models/recipes/update-reipe.dto';
import { RecipesDto } from '../models/recipes/recipes.dto';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe) private readonly recipeRepository: Repository<Recipe>,
    private readonly ingredientsService: IngredientsService,
    private readonly nutritionService: NutritionService,
    private readonly subrecipesService: SubrecipesService,
    private readonly categoriesService: CategoriesService,
  ) {}

  async createRecipe(data: CreateRecipeDto, author: User) {
    const ingredientsData: CreateIngredientDto[] = data.ingredientsData;
    const subrecipesData: CreateSubrecipeDto[] = data.subrecipesData;
    const title: string = data.title;
    const category: string = data.category;
    const notes: string = data.notes;
    const imageUrl: string = data.imageUrl;
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
        return {subrecipe: await this.subrecipesService.createSubrecipe(subrecipeData, linkedRecipe, savedRecipe), linkedRecipe};
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

  async updateRecipeById(id: string, data: UpdateRecipeDto, author: string) {
    const newIngredientsData: CreateIngredientDto[] = data.newIngredientsData;
    const newSubrecipesData: CreateSubrecipeDto[] = data.newSubrecipesData;
    const updateIngredientsData: UpdateIngredientDto[] = data.updateIngredientsData;
    const updateSubrecipesData: UpdateSubrecipeDto[] = data.updateSubrecipesData;
    const title: string = data.title;
    const category: string = data.category;
    const notes: string = data.notes;
    const imageUrl: string = data.imageUrl;
    const recipeToUpdate = await this.getRecipeById(id);
    const recipeAuthor = await recipeToUpdate.author;
    if (recipeAuthor.username !== author) {
      throw new BadRequestException(`You can only edit your own recipes`);
    }

    if (title) {
      recipeToUpdate.title = title;
    }
    if (category) {
      const newCategory = await this.categoriesService.getCategoryByName(category);
      if (newCategory) {
        recipeToUpdate.category = newCategory;
      }
    }
    if (notes) {
      recipeToUpdate.notes = notes;
    }
    if (imageUrl) {
      recipeToUpdate.imageURL = imageUrl;
    }

    const allNutrientsArr: ITotalNutrition[] = [];

    let recipeIngredientsTotalNutrition: ITotalNutrition;
    let recipeSubrecipesTotalNutrition: ITotalNutrition;

    if (newIngredientsData) {
      await Promise.all(newIngredientsData.map(async (ingredientData) => {
        const newIngredient = await this.ingredientsService.createIngredient(ingredientData, recipeToUpdate);
        recipeToUpdate.ingredients = [...await recipeToUpdate.ingredients, newIngredient];

        return newIngredient;
      }));
    }

    if (updateIngredientsData) {
      await Promise.all(updateIngredientsData.map(async (ingredientData) => {
        return await this.ingredientsService.updateIngredient(ingredientData);
      }));
    }

    if (newSubrecipesData) {
      await Promise.all(newSubrecipesData.map(async (subrecipeData) => {
        const linkedRecipe = await this.getRecipeById(subrecipeData.recipeId);
        const newSubrecipe = await this.subrecipesService.createSubrecipe(subrecipeData, linkedRecipe, recipeToUpdate);
        recipeToUpdate.subrecipes = [...await recipeToUpdate.subrecipes, newSubrecipe];

        return newSubrecipe;
      }));
    }

    if (updateSubrecipesData) {
      await Promise.all(updateSubrecipesData.map(async (subrecipeData) => {
        return await this.subrecipesService.updateSubrecipe(subrecipeData);
      }));
    }
    await this.recipeRepository.save(recipeToUpdate)
    const recipeWithUpdatedIngrAndSubrec = await this.getRecipeById(id);
    const recipeIngredients = recipeWithUpdatedIngrAndSubrec.ingredients;
    recipeIngredientsTotalNutrition = await this.nutritionService.calculateIngredientsTotalNutrition(recipeIngredients);
    if (recipeIngredientsTotalNutrition) {
      allNutrientsArr.push(recipeIngredientsTotalNutrition);
    }

    const recipeSubrecipes = await Promise.all(recipeWithUpdatedIngrAndSubrec.subrecipes.map(async (subrecipe) => {
      const linkedRecipeId = (await subrecipe.linkedRecipe).id;
      const linkedRecipe = await this.getRecipeById(linkedRecipeId)
      return {subrecipe, linkedRecipe};
    })).then(result => result);
    recipeSubrecipesTotalNutrition = await this.nutritionService.calculateSubrecipesTotalNutrition(recipeSubrecipes);
    if (recipeSubrecipesTotalNutrition) {
      allNutrientsArr.push(recipeSubrecipesTotalNutrition);
    }

    if (allNutrientsArr.length > 0) {
      const allNutrients = allNutrientsArr.reduce((acc, curr) => {
        const nutrientNames = Object.keys(curr.nutrients);
        nutrientNames.forEach((nutrientName: NutrientsEnum) => {
          acc.nutrients[nutrientName].value += curr.nutrients[nutrientName].value;
        });
        acc.weight += curr.weight;
        return acc;
      });

      const recipeNutritionToUpdate = recipeToUpdate.nutrition;
      const recipeNutrition = await this.nutritionService.updateNutrition(recipeNutritionToUpdate, allNutrients);
      recipeToUpdate.nutrition = recipeNutrition;
      recipeToUpdate.amount = allNutrients.weight;
    }

    return await this.recipeRepository.save(recipeToUpdate);
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

    const deleteRecipe = async () => {
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

  async getRecipes(query: RecipeQueryDto, route: string, user: User): Promise<RecipesDto> {
    const title = query.title ? query.title : '';
    const category = query.category ? query.category : '';
    const min = query.min ? +query.min : 0;
    const max = query.max ? +query.max : 0;
    const nutrient = query.nutrient ? query.nutrient : '';
    let page = query.page ? +query.page : 1;
    page = page < 0 ? 1 : page;
    let queryStr = `${route}?`;
    let limit =  query.limit ? +query.limit : 0;
    limit = limit > 100 ? 100 : limit;

    const queryBuilder = await this.recipeRepository
      .createQueryBuilder('recipe')
      .leftJoinAndSelect('recipe.ingredients', 'ingredient')
      .leftJoinAndSelect('recipe.category', 'category')
      .leftJoinAndSelect('recipe.subrecipes', 'subrecipe')
      .leftJoinAndSelect('recipe.nutrition', 'nutrition')
      .addOrderBy('recipe.title', 'ASC')
      .where('recipe.author = :author', {author: user});

    if (title) {
      queryBuilder.andWhere('LOWER(recipe.title) LIKE :title', {
        title: `%${title.toLowerCase()}%`,
      });
      queryStr = queryStr.concat(`titile=${title}&`);
    }

    if (category) {
      queryBuilder.andWhere('LOWER(recipe.category) LIKE :category', {
        category: `%${category.toLowerCase()}%`,
      });
      queryStr = queryStr.concat(`category=${category}&`);
    }

    // if (nutrient) {}

    if (limit) {
      queryBuilder.take(limit).skip((page - 1) * limit);
      queryStr = queryStr.concat(`limit=${limit}&`);
    }

    const recipes =  await queryBuilder.getMany();
    const recipesROArr = recipes.map((recipe) => this.recipeToRO(recipe));

    const total = await queryBuilder.getCount();
    const isNext = limit ? route && (total / limit >= page) : false;
    const isPrevious = route && page > 1;
    const recipesToReturn = new RecipesDto();
    recipesToReturn.recipes = recipesROArr;
    recipesToReturn.page = page;
    recipesToReturn.recipesCount = total < limit || limit === 0 ? total : limit;
    recipesToReturn.totalRecipes = total;
    recipesToReturn.next = isNext ? `${queryStr}page=${page + 1}` : '';
    recipesToReturn.previous = isPrevious ? `${queryStr}page=${page - 1}` : '';

    return recipesToReturn;
  }

  // Custom async forEach
  async asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }
}
