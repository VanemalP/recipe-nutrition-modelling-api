import { IngredientRO } from './../ingredients/ingredient-ro';
import { SubrecipeRO } from '../subrecipes/subrecipe-ro';
import { INutrition } from '../../common/interfaces/nutrition';

export interface RecipeRO {
  id: string;
  title: string;
  imageUrl: string;
  notes: string;
  measure: string;
  amount: number;
  created: Date;
  category: string;
  ingredients?: IngredientRO[];
  subrecipes?: SubrecipeRO[];
  nutrition: INutrition;
}
