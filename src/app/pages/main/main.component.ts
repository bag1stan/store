import { NgForOf, NgStyle, NgSwitch, NgSwitchCase } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  TuiTableDirective,
  TuiTableTbody,
  TuiTableTd,
  TuiTableTh,
} from '@taiga-ui/addon-table';
import {
  TuiLabel,
  TuiLoader,
  TuiNumberFormat,
  TuiScrollbar,
  TuiTextfieldComponent,
  TuiTextfieldOptionsDirective,
} from '@taiga-ui/core';
import { TuiChip, TuiInputNumber } from '@taiga-ui/kit';
import { delayWhen, finalize, mergeMap, tap } from 'rxjs';

import { Product } from '../../interfaces/product.interface';
import { SortByIdPipe } from '../../pipes/sort-by-id.pipe';
import { ApiService } from '../../services/api.service';
import { DialogService } from '../../services/dialog.service';
import { StateService } from '../../services/state.service';
import { CostChipComponent } from '../../shared/components/cost-chip/cost-chip.component';
import { IconButtonComponent } from '../../shared/components/icon-button/icon-button.component';
import { CurrencyCode } from '../../shared/enums/currency-code.enum';

@Component({
  selector: 'app-main',
  imports: [
    TuiLoader,
    ReactiveFormsModule,
    TuiLabel,
    TuiTextfieldComponent,
    FormsModule,
    TuiScrollbar,
    TuiChip,
    NgSwitchCase,
    NgSwitch,
    NgForOf,
    TuiTableTh,
    TuiTableTd,
    TuiTableTbody,
    TuiTableDirective,
    TuiInputNumber,
    SortByIdPipe,
    NgStyle,
    TuiTextfieldOptionsDirective,
    TuiNumberFormat,
    CostChipComponent,
    IconButtonComponent,
  ],
  providers: [DialogService],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {
  private readonly api = inject(ApiService);
  private readonly dialogService = inject(DialogService);
  private readonly state = inject(StateService);

  readonly isDarkTheme = this.state.isDarkTheme;
  readonly isFullScreen = this.state.isFullScreen;

  readonly store = this.state.state;

  readonly isProductsLoading = signal(false);
  readonly isOperationsLoading = signal(false);

  readonly kztCurrency = this.state.kztCurrency;
  readonly uanCurrency = this.state.uanCurrency;
  readonly percent = this.state.percent;

  readonly currencies = CurrencyCode;

  readonly fields = computed(() => {
    const apiRows = [
      { key: 'my_cost', label: 'Vinyl' },
      { key: 'competitors_price', label: 'Рынок' },
      { key: 'cost_price', label: 'Себес' },
      { key: 'result', label: 'Маржа' },
      { key: 'amount', label: 'Наличие\nПродано' },
    ];

    return this.isFullScreen()
      ? apiRows
      : [...apiRows, { key: 'operations', label: '' }];
  });

  constructor() {
    this.loadData();
  }

  onThemeChange(): void {
    this.state.toggleTheme();
  }

  onFullScreenModeChange(): void {
    this.state.toggleFullScreen();
  }

  onCellButtonClick() {
    this.dialogService.openCellDialog().subscribe();
  }

  private loadData(): void {
    this.isProductsLoading.set(true);

    this.api
      .getAll()
      .pipe(
        tap((items) => this.store.set(items)),
        finalize(() => this.isProductsLoading.set(false))
      )
      .subscribe();
  }

  computeResult(item: Product): number {
    const compKzt = item.my_cost;
    const costUpd = this.computeCostPriceUpd(item);

    return compKzt - costUpd;
  }

  computeCostPriceUpd(item: Product): number {
    const percent = (this.percent() + 100) / 100;

    return item.cost_price * percent * this.uanCurrency();
  }

  addOne() {
    this.dialogService
      .openAddDialog()
      .pipe(
        tap(() => this.isOperationsLoading.set(true)),
        mergeMap((product) => this.api.addOne(product)),
        tap((product) => this.state.addProduct(product)),
        finalize(() => this.isOperationsLoading.set(false))
      )
      .subscribe();
  }

  editOne(product: Product) {
    this.dialogService
      .openEditDialog(product)
      .pipe(
        tap(() => this.isOperationsLoading.set(true)),
        mergeMap((product) => this.api.updateOne(product)),
        tap((product) => this.state.updateProduct(product)),
        finalize(() => this.isOperationsLoading.set(false))
      )
      .subscribe();
  }

  deleteOne({ id, title }: Product) {
    this.dialogService
      .openDeleteDialog(title)
      .pipe(
        tap(() => this.isOperationsLoading.set(true)),
        delayWhen(() => this.api.deleteOne(id)),
        tap(() => this.state.deleteProduct(id)),
        finalize(() => this.isOperationsLoading.set(false))
      )
      .subscribe();
  }
}
