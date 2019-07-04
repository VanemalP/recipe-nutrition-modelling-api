import { Product } from './product.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Recipe } from './recipe.entity';

/**
 * Ingredient entity
 */
@Entity('ingredients')
export class Ingredient {
  /**
   * Id of the product
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;
  /**
   * Product
   */
  @ManyToOne(type => Product, product => product.ingredients, { eager: true })
  product: Product;
  /**
   * Quantity of the product
   */
  @Column({ default: 0 })
  quantity: number;
  /**
   * Unit of the product
   */
  @Column()
  unit: string;
  /**
   * Is the recipe deleted
   */
  @Column({ default: false })
  isDeleted: boolean;
  /**
   * Recipes using the product
   */
  @ManyToOne(type => Recipe, recipe => recipe.ingredients)
  recipe: Promise<Recipe>;
}
