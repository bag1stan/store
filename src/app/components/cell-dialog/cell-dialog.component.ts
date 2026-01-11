import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  TuiAlertService,
  TuiButton,
  TuiDataList,
  TuiDialogContext,
  TuiFormatNumberPipe,
  TuiLoader,
  TuiScrollbar,
  TuiSurface,
  TuiTextfieldComponent,
  TuiTextfieldOptionsDirective,
} from '@taiga-ui/core';
import {
  TuiChip,
  TuiDataListWrapperComponent,
  TuiFade,
  TuiFilterByInputPipe,
  TuiInputNumber,
  tuiItemsHandlersProvider,
} from '@taiga-ui/kit';
import { injectContext } from '@taiga-ui/polymorpheus';
import { Product } from '../../interfaces/product.interface';
import { StateService } from '../../services/state.service';
import { TuiComboBoxModule, TuiInputModule, TuiSelectModule } from '@taiga-ui/legacy';
import { catchError, EMPTY, filter, forkJoin, tap } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { SortByIdPipe } from '../../pipes/sort-by-id.pipe';
import { FilterWithAmountPipe } from '../../pipes/filter-with-amount.pipe';
import { FilterByAddedSellPipe } from '../../pipes/filter-by-added-sell.pipe';


@Component({
  imports: [
    ReactiveFormsModule,
    TuiButton,
    TuiDataListWrapperComponent,
    TuiFilterByInputPipe,
    FormsModule,
    TuiInputModule,
    TuiDataList,
    TuiComboBoxModule,
    TuiChip,
    TuiScrollbar,
    TuiInputNumber,
    TuiTextfieldComponent,
    TuiTextfieldOptionsDirective,
    TuiFade,
    TuiSelectModule,
    SortByIdPipe,
    TuiLoader,
    AsyncPipe,
    TuiFormatNumberPipe,
    TuiSurface,
    FilterWithAmountPipe,
    FilterByAddedSellPipe,
  ],
  providers: [
    tuiItemsHandlersProvider({
      stringify: ((x: Product) => x.title),
    }),
  ],
  templateUrl: './cell-dialog.component.html',
  styleUrl: './cell-dialog.component.scss'
})
export class CellDialogComponent {
  private readonly fb =  inject(FormBuilder);
  private readonly alertService = inject(TuiAlertService);
  private readonly context = injectContext<TuiDialogContext<unknown, void>>();

  private readonly stateService = inject(StateService);
  private readonly api = inject(ApiService);

  readonly kztCurrency = this.stateService.kztCurrency;
  readonly uanCurrency = this.stateService.uanCurrency;
  readonly percent = this.stateService.percent;
  readonly products = this.stateService.state;
  readonly productEntities = this.stateService.stateEntities;

  readonly items =  computed(() => this.stateService.state());
  readonly isLoading = signal(false);

  readonly addedSellIds = signal<number[]>([]);

  readonly form = this.fb.array<FormGroup>([]);
  readonly cellItemControl = this.fb.control<Product | null>(null);

  readonly soldAmount = computed(() => {
    return this.products().reduce((acc, product) => acc + product.sold, 0)
  })

  readonly sumSoldInKzt = computed(() => {
    const products = this.stateService.state();

    return products.reduce((acc, product) => {
      if (!product.sold) {
        return acc;
      }

      return acc + (this.computeResult(product) * product.sold)
    }, 0)
  })

  readonly formChanges = toSignal(this.form.valueChanges);

  readonly sellAmount = computed(() => {
    const changes = this.formChanges();

    if (!changes?.length) {
      return null;
    }

    return changes.reduce((acc, product) => acc + product.sold, 0)
  })

  readonly sumSellInKzt = computed(() => {
    const changes = this.formChanges();

    if (!changes?.length) {
      return null;
    }

    const sells = changes.map(({id}) =>
      ({...this.productEntities()[id], ...changes.find(product => product.id === id ) })
    );

    return sells.reduce((acc, sell) => {
      return acc + (this.computeResult(sell) * sell.sold)
    }, 0)
  })

  constructor() {
    this.cellItemControl.valueChanges.pipe(
      filter(Boolean),
      tap((product) => {
        const hasSold = this.form.controls.some(({value}) => value.id === product.id);
        if (hasSold) {
          this.showAlert('Товар уже добавлен');
          this.cellItemControl.reset();

          return;
        }

        this.addNewGroup(product);
        this.cellItemControl.reset()
      }),
      takeUntilDestroyed()
    ).subscribe()
  }

  private addNewGroup({ id, title, amount }: Product): void {
    this.addedSellIds.update(v => [ ...v, id ]);

    this.form.push(
      this.fb.nonNullable.group({
        id,
        title,
        amount,
        sold: this.fb.control(1, [Validators.required, Validators.min(1), Validators.max(amount)]), })
    )
  }

  deleteOne(index: number): void {
    const sellId = this.form.at(index).value.id;
    this.addedSellIds.update(v => v.filter((id) => id !== sellId));

    this.form.removeAt(index);
  }

  onSellButtonClick() {
    if (this.form.invalid) {
      this.showAlert('Заполни все поля правильно')
      return;
    }

    this.isLoading.set(true);

    const sells: Product[] = this.form.value;
    const productEntities = this.stateService.stateEntities();

    const requests = sells.map(
      ({ id, sold}) => {
        const productState = productEntities[id];

        return this.api.updateOne({
          ...productState,
          amount: productState.amount - sold,
          sold: productState.sold + sold
        });
      }
    )


    forkJoin(requests).pipe(
      tap((updatedProducts) => {
        const updatedProductEntities = updatedProducts.reduce(
          (acc, product) => ({...acc, [product.id]: product}),
          {} as Record<string, Product>);
        const updatedProductIds = Object.keys(updatedProductEntities);

        this.stateService.state.update(state =>
          state.map((product) =>
            updatedProductIds.includes(String(product.id))
              ? updatedProductEntities[product.id]
              : product
          ),
        );

        this.isLoading.set(false);
        this.context.completeWith(null);
      }),
      catchError(() => {
        this.showAlert('Возникла ошибка, попробуй снова');

        return EMPTY
      })
    ).subscribe()
  }

  showAlert(msg: string): void {
    this.alertService
      .open(msg, {
        icon: '@tui.circle-x',
        appearance: 'negative',
      })
      .subscribe();
  }

  private computeResult(item: Product): number {
    const compKzt = item.my_cost;
    const costUpd = this.computeCostPriceUpd(item);
    return compKzt - costUpd;
  }

  private computeCostPriceUpd(item: Product): number {
    const percent = (this.percent() + 100) / 100
    return item.cost_price * percent * this.uanCurrency();
  }
}
