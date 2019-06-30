import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

import { Recipe } from './recipe.entity';

/**
 * User entity
 */
@Entity('users')
export class User {
  /**
   * Id of the user
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;
  /**
   * Username
   */
  @Column()
  username: string;
  /**
   * Password
   */
  @Column()
  password: string;
  /**
   * Email
   */
  @Column()
  email: string;
  /**
   * First name
   */
  @Column('nvarchar')
  firstName: string;
  /**
   * Last name
   */
  @Column('nvarchar')
  lastName: string;
  /**
   * Time when the user joined the forum
   */
  @CreateDateColumn()
  joined: Date;
  /**
   * List of recipes created by the user
   */
  @OneToMany(type => Recipe, recipe => recipe.author)
  recipes: Promise<Recipe[]>;
}
