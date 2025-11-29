import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  TuiAlertService,
  TuiButton,
  TuiDialogContext,
  TuiLabel,
  TuiTextfieldComponent,
  TuiTextfieldDirective,
  TuiTextfieldOptionsDirective,
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
    TuiTextfieldOptionsDirective,
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

  readonly kztSvgIcon = kztSvg;

  readonly form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    cost_price: [0, Validators.required],
    competitors_price: [0],
    my_cost: [0],
  })

  constructor() {
    this.initFormValues()
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

    this.context.completeWith({...this.data, ...this.form.getRawValue()});
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
