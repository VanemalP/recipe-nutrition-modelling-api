import { CreateIngredientDto } from './../ingredients/create-ingredient.dto';
export class CreateRecipeDto {
  ingredientsData: CreateIngredientDto[];
  title: string;
  imageUrl: string;
  notes: string;
}
