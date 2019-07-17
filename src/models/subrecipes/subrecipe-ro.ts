import { INutrition } from '../../common/interfaces/nutrition';

export interface SubrecipeRO {
  id: string;
  recipe: string;
  unit: string;
  gramsPerMeasure: number;
  quantity: number;
  nutrition: INutrition;
}
