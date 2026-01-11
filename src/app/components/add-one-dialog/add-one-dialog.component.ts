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


@Component({
  imports: [
    TuiTextfieldComponent,
    TuiLabel,
    TuiTextfieldDirective,
    ReactiveFormsModule,
    TuiInputNumber,
    TuiButton,
  ],
  templateUrl: './add-one-dialog.component.html',
  styleUrl: './add-one-dialog.component.scss'
})
export class AddOneDialogComponent {
  private readonly fb =  inject(FormBuilder);
  private readonly alertService = inject(TuiAlertService);
  private readonly context = injectContext<TuiDialogContext<unknown, Product | void>>();

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

  constructor() {
    this.initFormValues()

    if (!this.isEditMode) {
      this.form.controls.sold.disable();
    }
  }

  private initFormValues() {
    const data = this.data;

    if (data) {
      this.form.patchValue(data)
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
