import { IsNotEmpty, IsInt, IsString, IsNumber } from 'class-validator';

export class CreateIngredientDto {
  @IsInt()
  productCode: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsString()
  unit: string;
}
