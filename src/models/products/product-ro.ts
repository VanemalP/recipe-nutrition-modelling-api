import { INutrition } from '../../common/interfaces/nutrition';
import { IMeasure } from '../../common/interfaces/measure';

export interface ProductRO {
  code: number;
  description: string;
  foodGroup: string;
  measures: IMeasure[];
  nutrition: INutrition;
}
