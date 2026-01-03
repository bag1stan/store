import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../interfaces/product.interface';

@Pipe({ name: 'sortById' })
export class SortByIdPipe implements PipeTransform {

  transform(value: Product[]): Product[] {
    return [...value].sort((a, b) => a.id - b.id);
  }
}
