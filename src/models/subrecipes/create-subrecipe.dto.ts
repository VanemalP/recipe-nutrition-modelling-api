import { IsString, IsNotEmpty, IsInt } from 'class-validator';
export class CreateSubrecipeDto {
  recipeId: string;

  @IsNotEmpty()
  @IsInt()
  quantity: number;

  @IsString()
  unit: string;
}
