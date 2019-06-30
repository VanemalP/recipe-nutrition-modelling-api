import { Entity, Column, OneToMany, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Product } from './product.entity';

/**
 * Measure entity
 */
@Entity('measures')
export class Measure {
  /**
   * Id of the measure
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;
  /**
   * Product that have this measure
   */
  @ManyToOne(type => Product, product => product.measures)
  product: Promise<Product>;
  /**
   * Measure type
   */
  @Column()
  measure: string;
  /**
   * Grams per measure
   */
  @Column()
  gramsPerMeasure: number;
}
