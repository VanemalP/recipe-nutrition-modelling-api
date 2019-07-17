import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
export class CreateSubrecipeDto {
  @IsString()
  recipeId: string;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsString()
  unit: string;
}
