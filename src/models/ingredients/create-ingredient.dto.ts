import { IsNotEmpty, IsInt, IsString } from 'class-validator';

export class CreateIngredientDto {
  @IsInt()
  productCode: number;

  @IsNotEmpty()
  @IsInt()
  quantity: number;

  @IsNotEmpty()
  @IsString()
  unit: string;
}
