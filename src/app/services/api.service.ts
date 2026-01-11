import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../interfaces/product.interface';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://x8ki-letl-twmt.n7.xano.io/api:V5WjvOLu';

  getAll() {
    return this.http.get<Product[]>(`${this.baseUrl}/product_price`);
  }

  addOne(product: Product) {
    return this.http.post<Product>(`${this.baseUrl}/product_price`, product);
  }

  updateOne(product: Pick<Product, 'id'> & Partial<Omit<Product, 'id'>>) {
    return this.http.put<Product>(`${this.baseUrl}/product_price/${product.id}`, product);
  }

  deleteOne(id: Product['id']) {
    return this.http.delete<void>(`${this.baseUrl}/product_price/${id}`);
  }
}
