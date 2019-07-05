import { CreateIngredientDto } from '../ingredients/create-ingredient.dto';
import { CreateSubrecipeDto } from '../subrecipes/create-subrecipe.dto';
import { UpdateIngredientDto } from '../ingredients/update-ingredient.dto';
import { UpdateSubrecipeDto } from '../subrecipes/update-subrecipe.dto';

export class UpdateRecipeDto {
  newIngredientsData?: CreateIngredientDto[];
  newSubrecipesData?: CreateSubrecipeDto[];
  updateIngredientsData?: UpdateIngredientDto[];
  updateSubrecipesData?: UpdateSubrecipeDto[];
  title?: string;
  category?: string;
  imageUrl?: string;
  notes?: string;
}
