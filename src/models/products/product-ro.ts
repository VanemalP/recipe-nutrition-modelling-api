import { INutrition } from '../../common/interfaces/nutrition';
import { IMeasure } from '../../common/interfaces/measure';

export interface ProductRO {
  description: string;
  foodGroup: string;
  measures: IMeasure[];
  nutrition: INutrition;
}
