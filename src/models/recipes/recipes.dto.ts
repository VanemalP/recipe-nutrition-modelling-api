import { RecipeRO } from './recipe-ro';

export class RecipesDto {
  recipes: RecipeRO[];
  page: number;
  recipesCount: number;
  totalRecipes: number;
  next?: string;
  previous?: string;
}
