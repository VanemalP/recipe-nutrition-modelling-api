import { Recipe } from './recipe.entity';
import { Entity, PrimaryColumn, OneToMany } from 'typeorm';

/**
 * Category entity
 */
@Entity('categories')
export class Category {
  /**
   * Name of the category
   */
  @PrimaryColumn()
  name: string;
  /**
   * Recipes which have the recipe
   */
  @OneToMany(type => Recipe, recipe => recipe.category)
  recipes: Promise<Recipe[]>;
}
