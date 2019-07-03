import { ProductsModule } from './../products/products.module';
import { Ingredient } from './../data/entities/ingredient.entity';
import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';
import { IngredientsService } from '../helpers/ingredients.service';
import { SubrecipesService } from '../helpers/subrecipes.service';
import { AuthModule } from '../auth/auth.module';
import { Recipe } from '../data/entities/recipe.entity';
import { Subrecipe } from '../data/entities/subrecipe.entity';
import { Nutrition } from '../data/entities/nutrition.entity';
import { NutritionService } from '../helpers/nutrition.service';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Recipe, Ingredient, Subrecipe, Nutrition]), ProductsModule],
  controllers: [RecipesController],
  providers: [RecipesService, IngredientsService, SubrecipesService, NutritionService],
  exports: [RecipesService],

})
export class RecipesModule {}
