import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  TuiAlertService,
  TuiButton,
  TuiDialogContext,
  TuiLabel,
  TuiTextfieldComponent,
  TuiTextfieldDirective,
} from '@taiga-ui/core';
import { TuiInputNumber } from '@taiga-ui/kit';
import { injectContext } from '@taiga-ui/polymorpheus';
import { kztSvg } from '../../icons/kzt.constant';
import { Product } from '../../interfaces/product.interface';
import { TuiInputYearModule, TuiSelectModule } from '@taiga-ui/legacy';
import { StateService } from '../../services/state.service';


@Component({
  imports: [
    TuiTextfieldComponent,
    TuiLabel,
    TuiTextfieldDirective,
    ReactiveFormsModule,
    TuiInputNumber,
    TuiButton,
    TuiInputYearModule,
    TuiSelectModule,

  ],
  templateUrl: './add-one-dialog.component.html',
  styleUrl: './add-one-dialog.component.scss'
})
export class AddOneDialogComponent {
  private readonly fb =  inject(FormBuilder);
  private readonly alertService = inject(TuiAlertService);
  private readonly context = injectContext<TuiDialogContext<unknown, Product | void>>();

  private readonly stateService = inject(StateService);

  readonly data = this.context.data;
  readonly isEditMode = Boolean(this.data);

  readonly kztSvgIcon = kztSvg;

  readonly form = this.fb.group({
    title: ['', Validators.required],
    cost_price: this.fb.control<number | null>(null, Validators.required),
    competitors_price: this.fb.control<number | null>(null),
    my_cost: this.fb.control<number | null>(null),
    amount: this.fb.control<number>(1, Validators.required),
    sold: this.fb.control<number>(0, Validators.required),
  })

  readonly myCostRubControl = this.fb.control<number | null>(null);
  readonly competitorsKztControl = this.fb.control<number | null>(null);

  constructor() {
    this.initFormValues()

    if (!this.isEditMode) {
      this.form.controls.sold.disable();
    }
  }

  onRubMyCostInput() {
    setTimeout(() => {
      const rub = this.myCostRubControl.value;
      const kztCurrency = this.stateService.kztCurrency();

      this.form.controls.my_cost.patchValue(rub ? Math.round(rub * kztCurrency) : null);
    }, 0)
  }

  onKztMyCostInput() {
    setTimeout(() => {
      const kzt = this.form.controls.my_cost.value;
      const kztCurrency = this.stateService.kztCurrency();

      this.myCostRubControl.patchValue(kzt ? Math.round(kzt / kztCurrency) : null)
    }, 0)
  }

  onRubCompetitorsInput() {
    setTimeout(() => {
      const rub = this.form.controls.competitors_price.value;
      const kztCurrency = this.stateService.kztCurrency();

      this.competitorsKztControl.patchValue(rub ? Math.round(rub * kztCurrency) : null);
    }, 0)
  }

  onKztCompetitorsInput() {
    setTimeout(() => {
      const kzt = this.competitorsKztControl.value;
      const kztCurrency = this.stateService.kztCurrency();

      this.form.controls.competitors_price.patchValue(
        kzt ? Math.round(kzt / kztCurrency) : null
      );
    }, 0)
  }

  private initFormValues() {
    const data = this.data;

    if (data) {
      this.form.patchValue(data)

      this.myCostRubControl.patchValue(Math.round(data.my_cost / this.stateService.kztCurrency()));
      this.competitorsKztControl.patchValue(Math.round(data.competitors_price * this.stateService.kztCurrency()));
    }
  }

  addOne() {
    if (this.form.invalid) {
      this.showAlert('Заполни все поля')
      return;
    }

    this.context.completeWith({ ...this.data, ...this.form.value });
  }

  showAlert(msg: string): void {
    this.alertService
      .open(msg, {
        icon: '@tui.circle-x',
        appearance: 'negative',
      })
      .subscribe();
  }
}
