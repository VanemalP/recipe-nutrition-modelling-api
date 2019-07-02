import { Entity, PrimaryColumn, Column, OneToMany, ManyToMany } from 'typeorm';
import { Product } from './product.entity';
import { Recipe } from './recipe.entity';

/**
 * Food group entity
 */
@Entity('food_groups')
export class FoodGroup {
  /**
   * Code of the food group
   */
  @PrimaryColumn()
  code: number;
  /**
   * Description of the food group
   */
  @Column()
  description: string;
  /**
   * Product using this food group
   */
  @OneToMany(type => Product, product => product.foodGroup)
  products: Promise<Product[]>;
  /**
   * Recipes using this food group
   */
  @ManyToMany(type => Recipe, recipe => recipe.foodGroups)
  recipes: Promise<Recipe[]>;
}
