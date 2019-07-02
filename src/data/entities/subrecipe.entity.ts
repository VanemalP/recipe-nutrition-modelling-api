import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

import { Recipe } from './recipe.entity';

/**
 * Subrecipe entity
 */
@Entity('subrecipe')
export class Subrecipe {
  /**
   * Id of the subrecipe
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;
  /**
   * Recipe
   */
  @ManyToOne(type => Recipe, recipe => recipe.subrecipes, { eager: true })
  linkedRecipe: Recipe;
  /**
   * Quantity of the subrecipe
   */
  @Column({ default: 0 })
  quantity: number;
  /**
   * Unit of the subrecipe
   */
  @Column()
  unit: string;
  /**
   * Recipes using the subrecipe
   */
  @ManyToOne(type => Recipe, recipe => recipe.subrecipes)
  recipe: Promise<Recipe>;
}
