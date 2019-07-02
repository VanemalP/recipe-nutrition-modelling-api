import { Ingredient } from './ingredient.entity';
import { Entity, PrimaryColumn, Column, OneToMany, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { Measure } from './measure.entity';
import { Nutrition } from './nutrition.entity';
import { FoodGroup } from './food-group.entity';

/**
 * Product entity
 */
@Entity('products')
export class Product {
  /**
   * Code of the product
   */
  @PrimaryColumn()
  code: number;
  /**
   * Description of the product
   */
  @Column('nvarchar')
  description: string;
  /**
   * Food group to which the product belongs
   */
  @ManyToOne(type => FoodGroup, foodGroup => foodGroup.products, { eager: true })
  foodGroup: FoodGroup;
  /**
   * Available measures of the product
   */
  @OneToMany(type => Measure, measure => measure.product, { eager: true })
  measures: Measure[];
  /**
   * Nutrient data for the product
   */
  @OneToOne(type => Nutrition, nutrition => nutrition.product, { eager: true })
  @JoinColumn()
  nutrition: Nutrition;
  /**
   * Recipe product
   */
  @OneToMany(type => Ingredient, ingredient => ingredient.product)
  ingredients: Promise<Ingredient[]>;
}
