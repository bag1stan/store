import { computed, Injectable, signal } from '@angular/core';
import { Product } from '../interfaces/product.interface';

@Injectable({ providedIn: 'root' })
export class StateService {
  readonly isDarkTheme = signal(false);
  readonly isFullScreen = signal(false);

  readonly state = signal<Product[]>([]);
  readonly stateEntities = computed(() => {
    const products = this.state();

    return products.reduce((acc, product) => (
      {...acc, [product.id]: product}
    ), {} as Record<string, Product>)
  });

  readonly kztCurrency = signal(6.6);
  readonly uanCurrency = signal(75);
  readonly percent = signal(15);

  addProduct(product: Product) {
    this.state.update((v) => [...v, product]);
  }

  updateProduct(updatedProduct: Product) {
    this.state.update((products) => products.map(
      (v) => v.id === updatedProduct.id ? updatedProduct : v)
    );
  }

  deleteProduct(id: Product['id']) {
    this.state.update((products) => products.filter((v) => v.id !== id));
  }

  toggleTheme() {
    this.isDarkTheme.update(v => !v)
  }

  toggleFullScreen() {
    this.isFullScreen.update(v => !v)
  }
}
