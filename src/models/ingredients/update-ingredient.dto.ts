import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';
export class UpdateIngredientDto {
  @IsString()
  id: string;

  @IsOptional()
  @IsNotEmpty()
  quantity?: number;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsBoolean()
  isDeleted?: boolean;
}
