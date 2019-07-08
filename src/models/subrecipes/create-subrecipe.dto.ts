import { IsString, IsNotEmpty, IsInt } from 'class-validator';
export class CreateSubrecipeDto {
  @IsString()
  recipeId: string;

  @IsNotEmpty()
  @IsInt()
  quantity: number;

  @IsString()
  unit: string;
}
