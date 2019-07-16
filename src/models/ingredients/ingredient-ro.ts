import { INutrition } from '../../common/interfaces/nutrition';
import { IMeasure } from '../../common/interfaces/measure';

export interface IngredientRO {
  id: string;
  product: string;
  measures: IMeasure[];
  unit: string;
  quantity: number;
  nutrition: INutrition;
}
