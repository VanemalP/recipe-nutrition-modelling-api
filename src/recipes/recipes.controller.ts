import { BadRequestFilter } from './../common/filters/bad-request.filter';
import { NotFoundFilter } from './../common/filters/not-found.filter';
import { AuthGuard } from '@nestjs/passport';
import { CreateRecipeDto } from './../models/recipes/create-recipe.dto';
import { User } from './../data/entities/user.entity';
import { Controller, UseGuards, Post, Body, Param, Get, Delete, UseFilters, Put, ValidationPipe } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { User as UserDec } from '../decorators/user.decorator';
import { UpdateRecipeDto } from '../models/recipes/update-reipe.dto';

@UseGuards(AuthGuard())
@UseFilters(NotFoundFilter, BadRequestFilter)
@Controller('api/recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post()
  async createRecipe(@Body(new ValidationPipe({ transform: true, whitelist: true })) data: CreateRecipeDto, @UserDec() user: User) {
    return await this.recipesService.createRecipe(data, user);
  }

  @Get(':id')
  async getRecipeById(@Param('id') id: string) {
    return await this.recipesService.getRecipeById(id);
  }

  @Put(':id')
  async updateRecipe(@Param('id') id: string, @Body(new ValidationPipe({ transform: true, whitelist: true })) data: UpdateRecipeDto, @UserDec() user: User) {
    return await this.recipesService.updateRecipeById(id, data, user.username);
  }

  @Delete(':id')
  async deleteRecipeById(@Param('id') id: string): Promise<{ message: string }> {
    return await this.recipesService.deleteRecipeById(id);
  }
}
