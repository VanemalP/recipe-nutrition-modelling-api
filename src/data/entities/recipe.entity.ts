import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, OneToOne, OneToMany, CreateDateColumn, JoinTable, JoinColumn } from 'typeorm';

import { User } from './user.entity';
import { Nutrition } from './nutrition.entity';
import { Subrecipe } from './subrecipe.entity';
import { Ingredient } from './ingredient.entity';
import { FoodGroup } from './food-group.entity';

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
   * Image url
   */
  @Column({default: 'https://images.all-free-download.com/images/graphiclarge/healthy_meal_background_vegetables_eggs_bacon_icons_6836169.jpg'})
  imageURL: string;
  /**
   * Notes
   */
  @Column('longtext', {default: ''})
  notes: string;
  /**
   * Measure of the recipe
   */
  @Column({default: 'g'})
  measure: string;
  /**
   * Weight in grams of the recipe
   */
  @Column({default: 0})
  amount: number;
  /**
   * Created on
   */
  @CreateDateColumn()
  Created: Date;
  /**
   * Author of the recipe
   */
  @ManyToOne(type => User, user => user.recipes)
  author: Promise<User>;
  /**
   * Food group to which the recipe belongs
   */
  @ManyToMany(type => FoodGroup, foodGroup => foodGroup.recipes, { eager: true })
  @JoinTable()
  foodGroups: FoodGroup[];
  /**
   * Ingredients in the recipe
   */
  @OneToMany(type => Ingredient, ingredient => ingredient.recipe, { eager: true })
  ingredients: Ingredient[];
  /**
   * Subrecipes in the recipe
   */
  @OneToMany(type => Subrecipe, subrecipe => subrecipe.recipe)
  subrecipes: Promise<Subrecipe[]>;
  /**
   * Derived recipes from the recipe
   */
  @OneToMany(type => Subrecipe, subrecipe => subrecipe.linkedRecipe)
  derivedRecipes: Promise<Subrecipe[]>;
  /**
   * Nutrient data for the recipe
   */
  @OneToOne(type => Nutrition, nutrition => nutrition.recipe, { eager: true })
  @JoinColumn()
  nutrition: Nutrition;
}
