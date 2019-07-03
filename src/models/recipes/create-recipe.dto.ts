import { CreateIngredientDto } from './../ingredients/create-ingredient.dto';
import { CreateSubrecipeDto } from '../subrecipes/create-subrecipe.dto';
export class CreateRecipeDto {
  ingredientsData?: CreateIngredientDto[];
  subrecipesData?: CreateSubrecipeDto[];
  title: string;
  imageUrl?: string;
  notes?: string;
}
