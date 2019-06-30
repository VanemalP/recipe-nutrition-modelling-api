import { Controller, UseFilters, UseGuards, Get, Query } from '@nestjs/common';

import { AuthGuardWithBlackisting } from '../common/guards/custom-auth.guard';
import { ProductsService } from './products.service';
import { ProductQueryDto } from '../models/products/product-query.dto';

@UseGuards(AuthGuardWithBlackisting)
@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getProducts(@Query() query: ProductQueryDto) {
    const route: string = `localhost:3000/api/products`;

    return this.productsService.getProducts(query, route);
  }
}
