import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateSubrecipeDto {
  id: string;

  @IsOptional()
  @IsInt()
  quantity?: number;

  @IsOptional()
  @IsString()
  unit?: string;

  isDeleted?: boolean;
}
