import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateSubrecipeDto {
  @IsString()
  id: string;

  @IsOptional()
  @IsInt()
  quantity?: number;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  isDeleted?: boolean;
}
