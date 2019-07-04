import { Recipe } from './recipe.entity';
import { INutrient } from './../../common/interfaces/nutrient';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { Product } from './product.entity';

/**
 * Nutrition entity
 */
@Entity('nutritions')
export class Nutrition {
  /**
   * Id of the nutrition
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;
  /**
   * Product that have this nutrition
   */
  @OneToOne(type => Product, product => product.nutrition, { nullable: true })
  product: Promise<Product>;
  /**
   * Product that have this nutrition
   */
  @OneToOne(type => Recipe, recipe => recipe.nutrition, { nullable: true })
  recipe: Promise<Recipe>;
  /**
   * Nutrient
   */
  @Column('simple-json')
  PROCNT: INutrient;
  /**
   * Nutrient
   */
  @Column('simple-json')
  FAT: INutrient;
  /**
   * Nutrient
   */
  @Column('simple-json')
  CHOCDF: INutrient;
  /**
   * Nutrient
   */
  @Column('simple-json')
  ENERC_KCAL: INutrient;
  /**
   * Nutrient
   */
  @Column('simple-json')
  SUGAR: INutrient;
  /**
   * Nutrient
   */
  @Column('simple-json')
  FIBTG: INutrient;
  /**
   * Nutrient
   */
  @Column('simple-json')
  CA: INutrient;
  /**
   * Nutrient
   */
  @Column('simple-json')
  FE: INutrient;
  /**
   * Nutrient
   */
  @Column('simple-json')
  P: INutrient;
  /**
   * Nutrient
   */
  @Column('simple-json')
  K: INutrient;
  /**
   * Nutrient
   */
  @Column('simple-json')
  NA: INutrient;
  /**
   * Nutrient
   */
  @Column('simple-json')
  VITA_IU: INutrient;
  /**
   * Nutrient
   */
  @Column('simple-json')
  TOCPHA: INutrient;
  /**
   * Nutrient
   */
  @Column('simple-json')
  VITD: INutrient;
  /**
   * Nutrient
   */
  @Column('simple-json')
  VITC: INutrient;
  /**
   * Nutrient
   */
  @Column('simple-json')
  VITB12: INutrient;
  /**
   * Nutrient
   */
  @Column('simple-json')
  FOLAC: INutrient;
  /**
   * Nutrient
   */
  @Column('simple-json')
  CHOLE: INutrient;
  /**
   * Nutrient
   */
  @Column('simple-json')
  FATRN: INutrient;
  /**
   * Nutrient
   */
  @Column('simple-json')
  FASAT: INutrient;
  /**
   * Nutrient
   */
  @Column('simple-json')
  FAMS: INutrient;
  /**
   * Nutrient
   */
  @Column('simple-json')
  FAPU: INutrient;
  /**
   * Is the nutrition deleted
   */
  @Column({ default: false })
  isDeleted: boolean;
}
