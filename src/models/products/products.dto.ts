import { ProductRO } from './product-ro';

export class ProductsDto {
  products: ProductRO[];
  page: number;
  productsCount: number;
  totalProducts: number;
  next?: string;
  previous?: string;
}
