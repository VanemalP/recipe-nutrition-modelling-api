import { AuthGuard } from '@nestjs/passport';
import { CreateRecipeDto } from './../models/recipes/create-recipe.dto';
import { User } from './../data/entities/user.entity';
import { Controller, UseGuards, Post, Body } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { User as UserDec } from '../decorators/user.decorator';

@UseGuards(AuthGuard())
@Controller('api/recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post()
  async createRecipe(@Body() data: CreateRecipeDto, @UserDec() user: User) {
    return await this.recipesService.createRecipe(data.ingredientsData, data.subrecipeData, data.title, data.notes, data.imageUrl, user);
  }
}
