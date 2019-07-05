import { Ingredient } from './../../data/entities/ingredient.entity';
import { Nutrition } from './../../data/entities/nutrition.entity';
import { Subrecipe } from '../../data/entities/subrecipe.entity';

export interface RecipeRO {
  title: string;
  nutrition: Nutrition;
  ingredients: Ingredient[];
  subrecipes: Subrecipe[];
}
