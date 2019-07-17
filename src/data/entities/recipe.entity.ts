import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, OneToOne, OneToMany, CreateDateColumn, JoinTable, JoinColumn } from 'typeorm';

import { User } from './user.entity';
import { Nutrition } from './nutrition.entity';
import { Subrecipe } from './subrecipe.entity';
import { Ingredient } from './ingredient.entity';
import { Category } from './categoriy.entity';

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
  @Column({default: '1 g'})
  measure: string;
  /**
   * Weight in grams of the recipe
   */
  @Column('double', {default: 0})
  amount: number;
  /**
   * Created on
   */
  @CreateDateColumn()
  created: Date;
  /**
   * Is the recipe deleted
   */
  @Column({ default: false })
  isDeleted: boolean;
  /**
   * Author of the recipe
   */
  @ManyToOne(type => User, user => user.recipes)
  author: Promise<User>;
  /**
   * Category of the recipe
   */
  @ManyToOne(type => Category, category => category.recipes, { eager: true })
  category: Category;
  /**
   * Ingredients in the recipe
   */
  @OneToMany(type => Ingredient, ingredient => ingredient.recipe, { eager: true })
  ingredients: Ingredient[];
  /**
   * Subrecipes in the recipe
   */
  @OneToMany(type => Subrecipe, subrecipe => subrecipe.recipe, { eager: true })
  subrecipes: Subrecipe[];
  /**
   * Derived recipes from the recipe
   */
  @OneToMany(type => Subrecipe, subrecipe => subrecipe.linkedRecipe)
  derivedRecipes: Promise<Subrecipe[]>;
  /**
   * Nutrient data for the recipe
   */
  @OneToOne(type => Nutrition, nutrition => nutrition.recipe, { eager: true, onDelete: 'CASCADE'  })
  @JoinColumn()
  nutrition: Nutrition;
}
