import { IsString, IsNotEmpty, MinLength, IsUrl, IsOptional } from 'class-validator';

import { CreateIngredientDto } from './../ingredients/create-ingredient.dto';
import { CreateSubrecipeDto } from '../subrecipes/create-subrecipe.dto';

export class CreateRecipeDto {
  @IsOptional()
  newIngredientsData?: CreateIngredientDto[];

  @IsOptional()
  newSubrecipesData?: CreateSubrecipeDto[];

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  title: string;

  @IsString()
  category: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
