import { AsyncPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import {
  TuiAppearanceOptions,
  TuiFormatNumberPipe,
  TuiSizeXXS,
} from '@taiga-ui/core';
import { TuiChip } from '@taiga-ui/kit';

@Component({
  selector: 'app-cost-chip',
  imports: [AsyncPipe, TuiChip, TuiFormatNumberPipe],
  templateUrl: './cost-chip.component.html',
  styleUrl: './cost-chip.component.scss',
})
export class CostChipComponent {
  readonly value = input.required<number>();

  readonly suffix = input('');
  readonly prefix = input('');

  readonly isDecimal = input(false);

  readonly size = input<TuiSizeXXS>('s');
  readonly appearance = input<TuiAppearanceOptions['appearance']>('primary');
}
