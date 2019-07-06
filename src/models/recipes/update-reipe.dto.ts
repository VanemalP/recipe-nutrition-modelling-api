import { IsString, MinLength, IsUrl, IsOptional } from 'class-validator';

import { CreateIngredientDto } from '../ingredients/create-ingredient.dto';
import { CreateSubrecipeDto } from '../subrecipes/create-subrecipe.dto';
import { UpdateIngredientDto } from '../ingredients/update-ingredient.dto';
import { UpdateSubrecipeDto } from '../subrecipes/update-subrecipe.dto';

export class UpdateRecipeDto {
  @IsOptional()
  newIngredientsData?: CreateIngredientDto[];

  @IsOptional()
  newSubrecipesData?: CreateSubrecipeDto[];

  @IsOptional()
  updateIngredientsData?: UpdateIngredientDto[];

  @IsOptional()
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

  @IsOptional()
  notes?: string;
}
