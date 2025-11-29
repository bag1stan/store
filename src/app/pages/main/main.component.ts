import { Component, inject, signal } from '@angular/core';
import { AsyncPipe, NgForOf } from '@angular/common';
import {
  TuiButton,
  TuiFormatNumberPipe,
  TuiLabel,
  TuiLoader,
  TuiScrollbar,
  TuiTextfieldComponent,
  TuiTextfieldDirective,
} from '@taiga-ui/core';
import {
  TuiTableCell,
  TuiTableDirective,
  TuiTableTbody,
  TuiTableTd,
  TuiTableTh,
  TuiTableThGroup,
  TuiTableTr,
} from '@taiga-ui/addon-table';
import { ApiService } from '../../services/api.service';
import { delayWhen, mergeMap, tap } from 'rxjs';
import { Product } from '../../interfaces/product.interface';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogService } from '../../services/dialog.service';
import { TuiChip } from '@taiga-ui/kit';

@Component({
  selector: 'app-main',
  imports: [
    NgForOf,
    TuiFormatNumberPipe,
    AsyncPipe,
    TuiTableDirective,
    TuiTableThGroup,
    TuiTableTh,
    TuiTableTbody,
    TuiTableTr,
    TuiTableCell,
    TuiTableTd,
    TuiButton,
    TuiLoader,
    ReactiveFormsModule,
    TuiLabel,
    TuiTextfieldComponent,
    TuiTextfieldDirective,
    FormsModule,
    TuiScrollbar,
    TuiChip,
  ],
  providers: [DialogService],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  private readonly api = inject(ApiService);
  private readonly dialogService = inject(DialogService);

  readonly store = signal<Product[]>([])
  readonly isLoading = signal(false);

  readonly columns = ['title', 'cost_price', 'cost_price_upd', 'competitors_price', 'my_cost', 'result', 'operations']

  kztCurrency = 6.6;
  uanCurrency = 75;

  constructor() {
    this.loadData();
  }

  private loadData(): void {
    this.isLoading.set(true);

    this.api.getAll().pipe(
      tap((items) => this.store.set(items)),
      tap(() => this.isLoading.set(false)),
    ).subscribe()
  }

  addOne() {
    this.dialogService.openAddDialog().pipe(
      tap(() => this.isLoading.set(true)),
      mergeMap((product) => this.api.addOne(product)),
      tap((product) => {
        this.isLoading.set(false)
        this.add(product);
      })
    )
      .subscribe();
  }


  editOne(product: Product) {
    this.dialogService.openEditDialog(product).pipe(
      tap(() => this.isLoading.set(true)),
      mergeMap((product) => this.api.updateOne(product)),
      tap((product) => {
        this.isLoading.set(false)
        this.update(product);
      })
    )
      .subscribe();
  }

  deleteOne({ id, title }: Product) {
    this.dialogService.openDeleteDialog(title).pipe(
      tap(() => this.isLoading.set(true)),
      delayWhen(() => this.api.deleteOne(id)),
      tap(() => {
        this.isLoading.set(false)
        this.delete(id);
      })
    ).subscribe()
  }

  private add(product: Product) {
    this.store.update((v) => [...v, product]);
  }

  private update(updatedProduct: Product) {
    this.store.update((products) => products.map(
      (v) => v.id === updatedProduct.id ? updatedProduct : v)
    );
  }

  private delete(id: Product['id']) {
    this.store.update((products) => products.filter((v) => v.id !== id));
  }
}
