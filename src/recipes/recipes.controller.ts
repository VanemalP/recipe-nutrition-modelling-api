import { AuthGuard } from '@nestjs/passport';
import { CreateRecipeDto } from './../models/recipes/create-recipe.dto';
import { User } from './../data/entities/user.entity';
import { Controller, UseGuards, Post, Body, Param, Get, Delete } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { User as UserDec } from '../decorators/user.decorator';

@UseGuards(AuthGuard())
@Controller('api/recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post()
  async createRecipe(@Body() data: CreateRecipeDto, @UserDec() user: User) {
    return await this.recipesService.createRecipe(data.ingredientsData, data.subrecipesData, data.title, data.notes, data.imageUrl, user);
  }

  @Get(':id')
  async getRecipeById(@Param('id') id: string) {
    return await this.recipesService.getRecipeById(id);
  }

  @Delete(':id')
  async deleteRecipeById(@Param('id') id: string) {
    return await this.recipesService.deleteRecipeById(id);
  }
}
