import { INutrition } from '../../common/interfaces/nutrition';

export interface SubrecipeRO {
  id: string;
  recipe: string;
  unit: string;
  quantity: number;
  nutrition: INutrition;
}
