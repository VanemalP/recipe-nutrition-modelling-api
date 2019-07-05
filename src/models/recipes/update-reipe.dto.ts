import { IsString, IsNotEmpty, MinLength, IsUrl, IsOptional } from 'class-validator';

import { CreateIngredientDto } from '../ingredients/create-ingredient.dto';
import { CreateSubrecipeDto } from '../subrecipes/create-subrecipe.dto';
import { UpdateIngredientDto } from '../ingredients/update-ingredient.dto';
import { UpdateSubrecipeDto } from '../subrecipes/update-subrecipe.dto';

export class UpdateRecipeDto {
  newIngredientsData?: CreateIngredientDto[];
  newSubrecipesData?: CreateSubrecipeDto[];
  updateIngredientsData?: UpdateIngredientDto[];
  updateSubrecipesData?: UpdateSubrecipeDto[];

  @IsOptional()
  @IsString()
  @MinLength(5)
  title?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;
  notes?: string;
}
