import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
export class UpdateIngredientDto {
  @IsString()
  id: string;

  @IsOptional()
  @IsNotEmpty()
  quantity?: number;

  @IsOptional()
  @IsString()
  unit?: string;
  isDeleted?: boolean;
}
