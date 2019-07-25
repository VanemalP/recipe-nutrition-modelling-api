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
import { UpdateRecipeDto } from '../models/recipes/update-recipe.dto';
import { RecipesDto } from '../models/recipes/recipes.dto';
import { RecipeRO } from '../models/recipes/recipe-ro';
import { INutrition } from '../common/interfaces/nutrition';
import { IMeasure } from '../common/interfaces/measure';

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
    const ingredientsData: CreateIngredientDto[] = data.newIngredientsData ? [...data.newIngredientsData] : [];
    const subrecipesData: CreateSubrecipeDto[] = data.newSubrecipesData ? [...data.newSubrecipesData] : [];
    const title: string = data.title;
    const recipe = await this.recipeRepository.findOne({
      where: {
        title,
      },
    });
    if (recipe) {
      throw new RecipeBadRequest('Recipe with this title already exists');
    }
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

    if (ingredientsData.length > 0) {
      const recipeIngredients = await Promise.all(ingredientsData.map(async (ingredientData) => {
        return await this.ingredientsService.createIngredient(ingredientData, savedRecipe);
      }));
      ingredientsTotalNutrition = await this.nutritionService.calculateIngredientsTotalNutrition(recipeIngredients);
      allNutrientsArr.push(ingredientsTotalNutrition);
    }

    if (subrecipesData.length > 0) {
      const recipeSubrecipes = await Promise.all(subrecipesData.map(async (subrecipeData) => {
        const linkedRecipe = await this.getRecipeById(subrecipeData.recipeId);
        return {subrecipe: await this.subrecipesService.createSubrecipe(subrecipeData, linkedRecipe, savedRecipe), linkedRecipe};
      }));
      subrecipesTotalNutrition = await this.nutritionService.calculateSubrecipesTotalNutrition(recipeSubrecipes);
      allNutrientsArr.push(subrecipesTotalNutrition);
    }

    const allNutrients = allNutrientsArr.reduce((acc, curr) => {
      const nutrientNames = Object.keys(acc.nutrients);
      nutrientNames.forEach((nutrientName: NutrientsEnum) => {
        acc.nutrients[nutrientName].value += curr.nutrients[nutrientName].value;
      });
      acc.weight += curr.weight;

      return acc;
    });

    const recipeNutrition = await this.nutritionService.createNutrition(allNutrients);
    savedRecipe.nutrition = recipeNutrition;
    savedRecipe.amount = allNutrients.weight;
    savedRecipe.measure =  `${allNutrients.weight} g`;

    return await this.recipeRepository.save(savedRecipe);
  }

  async updateRecipeById(id: string, data: UpdateRecipeDto, author: string) {
    const newIngredientsData: CreateIngredientDto[] = data.newIngredientsData ? [...data.newIngredientsData] : [];
    const newSubrecipesData: CreateSubrecipeDto[] = data.newSubrecipesData ? [...data.newSubrecipesData] : [];
    const updateIngredientsData: UpdateIngredientDto[] = data.updateIngredientsData ? [...data.updateIngredientsData] : [];
    const updateSubrecipesData: UpdateSubrecipeDto[] = data.updateSubrecipesData ? [...data.updateSubrecipesData] : [];
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

    if (newIngredientsData.length > 0) {
      await Promise.all(newIngredientsData.map(async (ingredientData) => {
        const newIngredient = await this.ingredientsService.createIngredient(ingredientData, recipeToUpdate);
        recipeToUpdate.ingredients = [...await recipeToUpdate.ingredients, newIngredient];

        return newIngredient;
      }));
    }

    if (updateIngredientsData.length > 0) {
      await Promise.all(updateIngredientsData.map(async (ingredientData) => {
        return await this.ingredientsService.updateIngredient(ingredientData);
      }));
    }

    if (newSubrecipesData.length > 0) {
      await Promise.all(newSubrecipesData.map(async (subrecipeData) => {
        const linkedRecipe = await this.getRecipeById(subrecipeData.recipeId);
        const newSubrecipe = await this.subrecipesService.createSubrecipe(subrecipeData, linkedRecipe, recipeToUpdate);
        recipeToUpdate.subrecipes = [...await recipeToUpdate.subrecipes, newSubrecipe];
        return newSubrecipe;
      }));
    }

    if (updateSubrecipesData.length > 0) {
      await Promise.all(updateSubrecipesData.map(async (subrecipeData) => {
        return await this.subrecipesService.updateSubrecipe(subrecipeData);
      }));
    }
    await this.recipeRepository.save(recipeToUpdate);
    const recipeWithUpdatedIngrAndSubrec = await this.getRecipeById(id);
    const recipeIngredients = recipeWithUpdatedIngrAndSubrec.ingredients;
    recipeIngredientsTotalNutrition = await this.nutritionService.calculateIngredientsTotalNutrition(recipeIngredients);
    if (recipeIngredientsTotalNutrition) {
      allNutrientsArr.push(recipeIngredientsTotalNutrition);
    }

    const recipeSubrecipes = await Promise.all(recipeWithUpdatedIngrAndSubrec.subrecipes.map(async (subrecipe) => {
      const linkedRecipeId = (await subrecipe.linkedRecipe).id;
      const linkedRecipe = await this.getRecipeById(linkedRecipeId);
      return {subrecipe, linkedRecipe};
    })).then(result => result);
    recipeSubrecipesTotalNutrition = await this.nutritionService.calculateSubrecipesTotalNutrition(recipeSubrecipes);
    if (recipeSubrecipesTotalNutrition) {
      allNutrientsArr.push(recipeSubrecipesTotalNutrition);
    }

    if (allNutrientsArr.length > 0) {
      const allNutrients = allNutrientsArr.reduce((acc, curr) => {
        const nutrientNames = Object.keys(acc.nutrients);
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
      recipeToUpdate.measure =  `${allNutrients.weight} g`;
    } else {
      throw new RecipeBadRequest('Recipe can not be empty');
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

  async getRecipeByIdAndAuthor(id: string, user: User) {
    const foundRecipe = await this.recipeRepository.findOne({
      where: {
        id,
        isDeleted: false,
        author: user,
      },
    });

    if (!foundRecipe) {
      throw new RecipeNotFound('Recipe not found');
    }
    return this.recipeToRO(foundRecipe, true);
  }

  async deleteRecipeById(id: string, author: string): Promise<{ message: string }> {
    const recipeToDelete = await this.recipeRepository.findOne({
      where: {id},
    });

    if (!recipeToDelete) {
      throw new RecipeNotFound('Recipe not found');
    }

    const recipeAuthor = await recipeToDelete.author;
    if (recipeAuthor.username !== author) {
      throw new BadRequestException(`You can only delete your own recipes`);
    }

    const derivedRecipes = await recipeToDelete.derivedRecipes;
    if (derivedRecipes.length > 0) {
      const hasUndeltedRecipe = derivedRecipes.some(recipe => recipe.isDeleted === false);
      if (hasUndeltedRecipe) {
        throw new RecipeBadRequest('This recipe is used in other recipe/s and can not be deleted');
      }
    }

    const deleteRecipe = async () => {
      const ingredients = recipeToDelete.ingredients;
      if (ingredients.length > 0) {
        await this.asyncForEach(ingredients, async (ingredient: Ingredient) => {
          if (!ingredient.isDeleted) {
            await this.ingredientsService.deleteIngredientByRecipeId(ingredient.id);
          }
        });
      }

      const subrecipes = recipeToDelete.subrecipes;
      if (subrecipes.length > 0) {
        await this.asyncForEach(subrecipes, async (subrecipe: Subrecipe) => {
          if (!subrecipe.isDeleted) {
            await this.subrecipesService.deleteSubrecipe(subrecipe.id);
          }
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

  async getRecipes(query: RecipeQueryDto, route: string, user: User) {
    const title = query.title ? query.title : '';
    const category = query.category ? query.category : '';
    const nutrient = query.nutrient ? query.nutrient : '';
    const min = query.min ? +query.min : 0;
    const max = query.max ? +query.max : 0;
    const orderBy = query.orderBy ? query.orderBy : 'recipe.created';
    const order = query.order ? query.order : 'DESC';
    let limit =  query.limit ? +query.limit : 0;
    limit = limit > 100 ? 100 : limit;
    let page = query.page ? +query.page : 1;
    page = page < 0 ? 1 : page;
    let queryStr = `${route}?`;

    const queryBuilder = await this.recipeRepository
      .createQueryBuilder('recipe')
      .leftJoinAndSelect('recipe.category', 'category')
      .leftJoinAndSelect('recipe.nutrition', 'nutrition')
      .innerJoin('recipe.author', 'author', 'author.username = :username', {
        username: user.username,
      })
      .addOrderBy(orderBy, order)
      .where('recipe.isDeleted = :isDeleted', { isDeleted: false});

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

    const recipes =  await queryBuilder.getMany();

    let filteredRecipes: Recipe[] = recipes;
    if (nutrient) {
      if (min && max) {
        queryStr = queryStr.concat(`nutrient=${nutrient}&min=${min}&max=${max}&`);
        filteredRecipes = recipes.filter(recipe => recipe.nutrition[nutrient].value / 100 * recipe.amount >= min && recipe.nutrition[nutrient].value  / 100 * recipe.amount <= max);
      } else if (min) {
        queryStr = queryStr.concat(`nutrient=${nutrient}&min=${min}&`);
        filteredRecipes = recipes.filter(recipe => recipe.nutrition[nutrient].value / 100 * recipe.amount >= min);
      } else if (max) {
        queryStr = queryStr.concat(`nutrient=${nutrient}&max=${max}&`);
        filteredRecipes = recipes.filter(recipe => recipe.nutrition[nutrient].value / 100 * recipe.amount <= max);
      }
    }

    queryStr = queryStr.concat(`orderBy=${orderBy}&order=${order}`);

    // Filter precipes by nutrient value per 100g

    // let filteredRecipes: Recipe[] = recipes;
    // if (nutrient) {
    //   if (min && max) {
    //     queryStr = queryStr.concat(`nutrient=${nutrient}&min=${min}&max=${max}&`);
    //     filteredRecipes = recipes.filter(recipe => recipe.nutrition[nutrient].value >= min && recipe.nutrition[nutrient].value <= max);
    //   } else if (min) {
    //     queryStr = queryStr.concat(`nutrient=${nutrient}&min=${min}&`);
    //     filteredRecipes = recipes.filter(recipe => recipe.nutrition[nutrient].value >= min);
    //   } else if (max) {
    //     queryStr = queryStr.concat(`nutrient=${nutrient}&max=${max}&`);
    //     filteredRecipes = recipes.filter(recipe => recipe.nutrition[nutrient].value <= max);
    //   }
    // }

    const recipesROArr = await Promise.all(filteredRecipes.map(recipe => this.recipeToRO(recipe, false))).then(result => result);

    const total = recipesROArr.length;
    page = page > total / limit ? Math.ceil(total / limit) : page;
    const isNext = limit ? route && (total / limit >= page) : false;
    const isPrevious = route && page > 1;
    const recipesToReturn = new RecipesDto();
    const itemsToShow = limit === 0 ? total : limit;
    recipesToReturn.recipes = this.paginate(recipesROArr, itemsToShow, page);
    recipesToReturn.page = page;
    recipesToReturn.recipesCount = total < limit || limit === 0 ? total : recipesToReturn.recipes.length;
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

  private async recipeToRO(recipe: Recipe, isFindOne: boolean): Promise<RecipeRO> {
    const nutrition: INutrition = {
      PROCNT: recipe.nutrition.PROCNT,
      FAT: recipe.nutrition.FAT,
      CHOCDF: recipe.nutrition.CHOCDF,
      ENERC_KCAL: recipe.nutrition.ENERC_KCAL,
      SUGAR: recipe.nutrition.SUGAR,
      FIBTG: recipe.nutrition.FIBTG,
      CA: recipe.nutrition.CA,
      FE: recipe.nutrition.FE,
      P: recipe.nutrition.P,
      K: recipe.nutrition.K,
      NA: recipe.nutrition.NA,
      VITA_IU: recipe.nutrition.VITA_IU,
      TOCPHA: recipe.nutrition.TOCPHA,
      VITD: recipe.nutrition.VITD,
      VITC: recipe.nutrition.VITC,
      VITB12: recipe.nutrition.VITB12,
      FOLAC: recipe.nutrition.FOLAC,
      CHOLE: recipe.nutrition.CHOLE,
      FATRN: recipe.nutrition.FATRN,
      FASAT: recipe.nutrition.FASAT,
      FAMS: recipe.nutrition.FAMS,
      FAPU: recipe.nutrition.FAPU,
    };

    const recipeRO: RecipeRO = {
      id: recipe.id,
      title: recipe.title,
      imageUrl: recipe.imageURL,
      notes: recipe.notes,
      measure: recipe.measure,
      gramsPerMeasure: recipe.amount,
      created: recipe.created,
      category: recipe.category.name,
      nutrition,
    };

    if (isFindOne) {
      recipeRO.ingredients = recipe.ingredients.map(ingredient => {
        if (!ingredient.isDeleted) {
          const ingrNutrition: INutrition = {
            PROCNT: ingredient.product.nutrition.PROCNT,
            FAT: ingredient.product.nutrition.FAT,
            CHOCDF: ingredient.product.nutrition.CHOCDF,
            ENERC_KCAL: ingredient.product.nutrition.ENERC_KCAL,
            SUGAR: ingredient.product.nutrition.SUGAR,
            FIBTG: ingredient.product.nutrition.FIBTG,
            CA: ingredient.product.nutrition.CA,
            FE: ingredient.product.nutrition.FE,
            P: ingredient.product.nutrition.P,
            K: ingredient.product.nutrition.K,
            NA: ingredient.product.nutrition.NA,
            VITA_IU: ingredient.product.nutrition.VITA_IU,
            TOCPHA: ingredient.product.nutrition.TOCPHA,
            VITD: ingredient.product.nutrition.VITD,
            VITC: ingredient.product.nutrition.VITC,
            VITB12: ingredient.product.nutrition.VITB12,
            FOLAC: ingredient.product.nutrition.FOLAC,
            CHOLE: ingredient.product.nutrition.CHOLE,
            FATRN: ingredient.product.nutrition.FATRN,
            FASAT: ingredient.product.nutrition.FASAT,
            FAMS: ingredient.product.nutrition.FAMS,
            FAPU: ingredient.product.nutrition.FAPU,
          };
          const ingrMeasures: IMeasure[] = ingredient.product.measures.map(msr => {
            const measureToReturn: IMeasure = {
              measure: `${msr.amount} ${msr.measure}`,
              gramsPerMeasure: msr.gramsPerMeasure,
            };
            return measureToReturn;
          }).sort((a, b) => {
            if (a.measure < b.measure) { return -1; }
            if (a.measure > b.measure) { return 1; }
            return 0;
          });

          return {
            id: ingredient.id,
            product: ingredient.product.description,
            measures: ingrMeasures,
            unit: ingredient.unit,
            quantity: ingredient.quantity,
            nutrition: ingrNutrition,
          };
        }
      }).filter(ingr => ingr !== undefined);
      recipeRO.subrecipes = await Promise.all(recipe.subrecipes.map(async (subrecipe) => {
        if (!subrecipe.isDeleted) {
          const linkedRecipeId = (await subrecipe.linkedRecipe).id;
          const linkedRecipe = await this.getRecipeById(linkedRecipeId);
          const ingrNutrition: INutrition = {
            PROCNT: linkedRecipe.nutrition.PROCNT,
            FAT: linkedRecipe.nutrition.FAT,
            CHOCDF: linkedRecipe.nutrition.CHOCDF,
            ENERC_KCAL: linkedRecipe.nutrition.ENERC_KCAL,
            SUGAR: linkedRecipe.nutrition.SUGAR,
            FIBTG: linkedRecipe.nutrition.FIBTG,
            CA: linkedRecipe.nutrition.CA,
            FE: linkedRecipe.nutrition.FE,
            P: linkedRecipe.nutrition.P,
            K: linkedRecipe.nutrition.K,
            NA: linkedRecipe.nutrition.NA,
            VITA_IU: linkedRecipe.nutrition.VITA_IU,
            TOCPHA: linkedRecipe.nutrition.TOCPHA,
            VITD: linkedRecipe.nutrition.VITD,
            VITC: linkedRecipe.nutrition.VITC,
            VITB12: linkedRecipe.nutrition.VITB12,
            FOLAC: linkedRecipe.nutrition.FOLAC,
            CHOLE: linkedRecipe.nutrition.CHOLE,
            FATRN: linkedRecipe.nutrition.FATRN,
            FASAT: linkedRecipe.nutrition.FASAT,
            FAMS: linkedRecipe.nutrition.FAMS,
            FAPU: linkedRecipe.nutrition.FAPU,
          };
          return {
            id: subrecipe.id,
            recipe: linkedRecipe.title,
            unit: subrecipe.unit,
            gramsPerMeasure: linkedRecipe.amount,
            quantity: subrecipe.quantity,
            nutrition: ingrNutrition,
          };
        }
      })).then(result => result.filter(res => res !== undefined));
    }

    return recipeRO;
  }

  private paginate(recipes: RecipeRO[], limit: number, page: number): RecipeRO[] {
    const startIndex = (page - 1) * limit;
    const endIndex = (page - 1) * limit + limit;
    return recipes.slice(startIndex, endIndex);
  }
}
