export class RecipeQueryDto {
  title?: string;
  category?: string;
  min?: string;
  max?: string;
  nutrient?: string;
  page?: string;
  limit?: string;
  orderBy?: 'recipe.title' | 'recipe.created';
  order?: 'ASC' | 'DESC';
}
