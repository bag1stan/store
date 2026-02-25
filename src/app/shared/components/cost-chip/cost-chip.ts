import { Component, input } from '@angular/core';
import { TuiAppearanceOptions, TuiFormatNumberPipe, TuiSizeXXS } from '@taiga-ui/core';
import { CurrencyCode } from '../../enums/currency-code.enum';
import { TuiChip } from '@taiga-ui/kit';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-cost-chip',
  imports: [
    AsyncPipe,
    TuiChip,
    TuiFormatNumberPipe,
  ],
  templateUrl: './cost-chip.html',
  styleUrl: './cost-chip.scss',
})
export class CostChip {
  readonly value = input.required<number>();

  readonly currency = input(CurrencyCode.KZT);

  readonly prefix = input('')

  readonly size = input<TuiSizeXXS>('s')
  readonly appearance = input<TuiAppearanceOptions['appearance']>('primary');
}
