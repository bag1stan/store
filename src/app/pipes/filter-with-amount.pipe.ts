import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../interfaces/product.interface';

@Pipe({ name: 'filterWithAmount' })
export class FilterWithAmountPipe implements PipeTransform {

  transform(value: readonly Product[]): Product[] {
    return value.filter((product) => Boolean(product.amount));
  }
}
