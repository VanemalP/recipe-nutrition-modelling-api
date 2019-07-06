import { INutrition } from '../../common/interfaces/nutrition';

export interface IngredientRO {
  id: string;
  product: string;
  unit: string;
  quantity: number;
  nutrition: INutrition;
}
