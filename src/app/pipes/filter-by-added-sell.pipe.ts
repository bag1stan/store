import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../interfaces/product.interface';

@Pipe({ name: 'filterByAddedSell' })
export class FilterByAddedSellPipe implements PipeTransform {

  transform(value: readonly Product[], addedSellIds: Product['id'][]): Product[] {
    return value.filter(({ id }) => !addedSellIds.includes(id));
  }
}
