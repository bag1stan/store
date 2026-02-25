import { Component, computed, inject, signal } from '@angular/core';
import {
  TuiAlertService,
  TuiButton,
  TuiLabel,
  TuiLoader,
  TuiNumberFormat,
  TuiScrollbar,
  TuiTextfieldComponent,
  TuiTextfieldOptionsDirective,
} from '@taiga-ui/core';
import { ApiService } from '../../services/api.service';
import { catchError, delayWhen, EMPTY, mergeMap, tap } from 'rxjs';
import { Product } from '../../interfaces/product.interface';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogService } from '../../services/dialog.service';
import { TuiChip, TuiInputNumber } from '@taiga-ui/kit';
import { NgForOf, NgStyle, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { TuiTableDirective, TuiTableTbody, TuiTableTd, TuiTableTh } from '@taiga-ui/addon-table';
import { SortByIdPipe } from '../../pipes/sort-by-id.pipe';
import { StateService } from '../../services/state.service';
import { CostChip } from '../../shared/components/cost-chip/cost-chip';
import { CurrencyCode } from '../../shared/enums/currency-code.enum';

@Component({
  selector: 'app-main',
  imports: [
    TuiButton,
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
    NgSwitchDefault,
    TuiTableTh,
    TuiTableTd,
    TuiTableTbody,
    TuiTableDirective,
    TuiInputNumber,
    SortByIdPipe,
    NgStyle,
    TuiTextfieldOptionsDirective,
    TuiNumberFormat,
    CostChip,
  ],
  providers: [DialogService],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  private readonly alertService = inject(TuiAlertService);
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

  constructor() {
    this.loadData();
  }

  readonly fields = computed(() => {
    const apiRows = [
      { key: 'my_cost', label: 'Vinyl' },
      { key: 'competitors_price', label: 'Рынок' },
      { key: 'cost_price', label: 'Себес' },
      { key: 'result', label: 'Маржа' },
      { key: 'amount', label: 'Наличие\nПродано' },
    ];

    return this.isFullScreen() ? apiRows : [...apiRows, { key: 'operations', label: '' }];
  });

  onThemeChange(): void {
    this.state.toggleTheme();
  }

  onFullScreenModeChange(): void {
    this.state.toggleFullScreen();
  }

  onCellButtonClick() {
    this.dialogService.openCellDialog().subscribe();
  }

  computeResult(item: Product): number {
    const compKzt = item.my_cost;
    const costUpd = this.computeCostPriceUpd(item);
    return compKzt - costUpd;
  }

  computeCostPriceUpd(item: Product): number {
    const percent = (this.percent() + 100) / 100
    return item.cost_price * percent * this.uanCurrency();
  }

  private loadData(): void {
    this.isProductsLoading.set(true);

    this.api.getAll().pipe(
      tap((items) => this.store.set(items)),
      tap(() => this.isProductsLoading.set(false)),
      catchError(() => {
        this.showAlert('Возникла ошибка, попробуй снова');
        this.isProductsLoading.set(false)

        return EMPTY
      })
    ).subscribe()
  }

  addOne() {
    this.dialogService.openAddDialog().pipe(
      tap(() => this.isOperationsLoading.set(true)),
      mergeMap((product) => this.api.addOne(product)),
      tap((product) => {
        this.isOperationsLoading.set(false)
        this.state.addProduct(product);
      }),
      catchError(() => {
        this.showAlert('Возникла ошибка, попробуй снова');
        this.isOperationsLoading.set(false)

        return EMPTY
      })
    )
      .subscribe();
  }


  editOne(product: Product) {
    this.dialogService.openEditDialog(product).pipe(
      tap(() => this.isOperationsLoading.set(true)),
      mergeMap((product) => this.api.updateOne(product)),
      tap((product) => {
        this.isOperationsLoading.set(false)
        this.state.updateProduct(product);
      }),
      catchError(() => {
        this.showAlert('Возникла ошибка, попробуй снова');
        this.isOperationsLoading.set(false)

        return EMPTY
      })
    )
      .subscribe();
  }

  deleteOne({ id, title }: Product) {
    this.dialogService.openDeleteDialog(title).pipe(
      tap(() => this.isOperationsLoading.set(true)),
      delayWhen(() => this.api.deleteOne(id)),
      tap(() => {
        this.isOperationsLoading.set(false)
        this.state.deleteProduct(id);
      }),
      catchError(() => {
        this.showAlert('Возникла ошибка, попробуй снова');
        this.isOperationsLoading.set(false)

        return EMPTY
      })
    ).subscribe()
  }

  private showAlert(msg: string): void {
    this.alertService
      .open(msg, {
        icon: '@tui.circle-x',
        appearance: 'negative',
      })
      .subscribe();
  }
}
