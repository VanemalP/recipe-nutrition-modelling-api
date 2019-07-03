import { Controller, UseFilters, UseGuards, Get, Query, Param, ParseIntPipe } from '@nestjs/common';

import { ProductsService } from './products.service';
import { ProductQueryDto } from '../models/products/product-query.dto';
import { NotFoundFilter } from '../common/filters/not-found.filter';
import { AuthGuard } from '@nestjs/passport';

@UseFilters(NotFoundFilter)
@UseGuards(AuthGuard())
@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getProducts(@Query() query: ProductQueryDto) {
    const route: string = `localhost:3000/api/products`;

    return await this.productsService.getProducts(query, route);
  }

  @Get(':code')
  async getProductByCode(@Param('code', new ParseIntPipe()) code: number) {

    return await this.productsService.getProductByCode(code);
  }
}
