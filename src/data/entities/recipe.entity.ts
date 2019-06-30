import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, OneToOne, OneToMany } from 'typeorm';

import { RecipeProduct } from './recipe-product';
import { User } from './user.entity';
import { Nutrition } from './nutrition.entity';

/**
 * Recipe entity
 */
@Entity('recipes')
export class Recipe {
  /**
   * Id of the recipe
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;
  /**
   * Title
   */
  @Column('nvarchar')
  title: string;
  /**
   * Food group to which the product belongs
   */
  @Column('nvarchar')
  foodGroup: string;
  /**
   * Author of the recipe
   */
  @ManyToOne(type => User, user => user.recipes)
  author: Promise<User>;
  /**
   * Products in the recipe
   */
  @OneToMany(type => RecipeProduct, recipeProduct => recipeProduct.recipes, { eager: true })
  recipeProducts: RecipeProduct[];
  /**
   * Subrecipes in the recipe
   */
  @ManyToMany(type => Recipe, recipe => recipe.subrecipes)
  subrecipes: Promise<Recipe[]>;
  /**
   * Nutrient data for the recipe
   */
  @OneToOne(type => Nutrition, nutrition => nutrition.recipe, { eager: true })
  nutrition: Nutrition;
}
