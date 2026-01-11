import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../interfaces/product.interface';

@Pipe({ name: 'sortByName' })
export class SortByNamePipe implements PipeTransform {

  transform(value: readonly Product[]): Product[] {
    return [...value].sort((a, b) => a.title.localeCompare(b.title, 'ru'));
  }
}
