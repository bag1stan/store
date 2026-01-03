import { Injectable, signal } from '@angular/core';
import { Product } from '../interfaces/product.interface';

@Injectable({ providedIn: 'root' })
export class StateService {
  readonly isDarkTheme = signal(false);

  readonly store = signal<Product[]>([]);

  addProduct(product: Product) {
    this.store.update((v) => [...v, product]);
  }

  updateProduct(updatedProduct: Product) {
    this.store.update((products) => products.map(
      (v) => v.id === updatedProduct.id ? updatedProduct : v)
    );
  }

  deleteProduct(id: Product['id']) {
    this.store.update((products) => products.filter((v) => v.id !== id));
  }

  toggleTheme() {
    this.isDarkTheme.update(v => !v)
  }
}
