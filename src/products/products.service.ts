import { ProductNotFound } from './../common/exeptions/product-not-found';
import { ProductsDto } from './../models/products/products.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from './../data/entities/product.entity';
import { ProductQueryDto } from './../models/products/product-query.dto';
import { ProductRO } from '../models/products/product-ro';
import { IMeasure } from '../common/interfaces/measure';
import { INutrition } from '../common/interfaces/nutrition';

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Product) private readonly productRepository: Repository<Product>) {}

  async getProducts(query: ProductQueryDto, route: string): Promise<ProductsDto> {
    const description = query.description ? query.description : '';
    const foodGroup = query.foodGroup ? query.foodGroup : '';
    let limit =  query.limit ? +query.limit : 0;
    limit = limit > 100 ? 100 : limit;
    let page = query.page ? +query.page : 1;
    page = page < 0 ? 1 : page;
    let queryStr = `${route}?`;

    const queryBuilder = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.measures', 'measure')
      .leftJoinAndSelect('product.nutrition', 'nutrition')
      .leftJoin('product.ingredients', 'ingredients')
      .addOrderBy('product.description', 'ASC');

    if (description) {
      queryBuilder.where('LOWER(product.description) LIKE :description', {
        description: `%${description.toLowerCase()}%`,
      });
      queryStr = queryStr.concat(`description=${description}&`);
    }

    if (foodGroup) {
      queryBuilder.innerJoinAndSelect('product.foodGroup', 'foodGroup', 'LOWER(foodGroup.description) LIKE :desription', {
        desription: `%${foodGroup.toLowerCase()}%`,
      });
      queryStr = queryStr.concat(`foodGroup=${foodGroup}&`);
    } else {
      queryBuilder.leftJoinAndSelect('product.foodGroup', 'foodGroup');
    }

    if (limit) {
      queryBuilder.take(limit).skip((page - 1) * limit);
      queryStr = queryStr.concat(`limit=${limit}&`);
    }

    const products =  await queryBuilder.getMany();
    const productsROArr = products.map(prod => this.productToRO(prod));

    const total =  await queryBuilder.getCount();
    const isNext = limit ? route && (total / limit > page) : false;
    const isPrevious = route && page > 1;
    const productsToReturn = new ProductsDto();
    productsToReturn.products = productsROArr;
    productsToReturn.page = page;
    productsToReturn.productsCount = total < limit || limit === 0 ? total : limit;
    productsToReturn.totalProducts = total;
    productsToReturn.next = isNext ? `${queryStr}page=${page + 1}` : '';
    productsToReturn.previous = isPrevious ? `${queryStr}page=${page - 1}` : '';

    return productsToReturn;
  }

  async getProductByCode(productCode: number) {
    const product = await this.productRepository.findOne({
      where: {code: productCode},
    });

    if (!product) {
      throw new ProductNotFound();
    }

    return product;
  }

  private productToRO(product: Product): ProductRO {
    const measures: IMeasure[] = product.measures.map(msr => {
      const measureToReturn: IMeasure = {
        measure: msr.measure,
        gramsPerMeasure: msr.gramsPerMeasure,
      };

      return measureToReturn;
    });
    const nutrition: INutrition = {
        PROCNT: product.nutrition.PROCNT,
        FAT: product.nutrition.FAT,
        CHOCDF: product.nutrition.CHOCDF,
        ENERC_KCAL: product.nutrition.ENERC_KCAL,
        SUGAR: product.nutrition.SUGAR,
        FIBTG: product.nutrition.FIBTG,
        CA: product.nutrition.CA,
        FE: product.nutrition.FE,
        P: product.nutrition.P,
        K: product.nutrition.K,
        NA: product.nutrition.NA,
        VITA_IU: product.nutrition.VITA_IU,
        TOCPHA: product.nutrition.TOCPHA,
        VITD: product.nutrition.VITD,
        VITC: product.nutrition.VITC,
        VITB12: product.nutrition.VITB12,
        FOLAC: product.nutrition.FOLAC,
        CHOLE: product.nutrition.CHOLE,
        FATRN: product.nutrition.FATRN,
        FASAT: product.nutrition.FASAT,
        FAMS: product.nutrition.FAMS,
        FAPU: product.nutrition.FAPU,
      };

    const productRO: ProductRO = {
      code: product.code,
      description: product.description,
      foodGroup: product.foodGroup.description,
      measures,
      nutrition,
    };

    return productRO;
  }
}
