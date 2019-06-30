import { RecipeProduct } from './recipe-product';
import { Entity, PrimaryColumn, Column,  OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Measure } from './measure.entity';
import { Nutrition } from './nutrition.entity';

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
  @Column()
  foodGroup: string;
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
  @OneToMany(type => RecipeProduct, recipeProduct => recipeProduct.product)
  recipeProducts: Promise<RecipeProduct[]>;
}
