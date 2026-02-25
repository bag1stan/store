import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Product } from '../interfaces/product.interface';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);

  getAll() {
    return this.http.get<Product[]>(`/api/product_price`);
  }

  updateBatch(updates: Product[]) {
    return this.http.post<{ updates: Product[] }>(
      `/api/product_prices/bulk_update`,
      { updates }
    );
  }

  addOne(product: Product) {
    return this.http.post<Product>(`/api/product_price`, product);
  }

  updateOne(product: Pick<Product, 'id'> & Partial<Omit<Product, 'id'>>) {
    return this.http.put<Product>(`/api/product_price/${product.id}`, product);
  }

  deleteOne(id: Product['id']) {
    return this.http.delete<void>(`/api/product_price/${id}`);
  }
}
