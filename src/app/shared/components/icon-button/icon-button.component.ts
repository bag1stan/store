import { Component, input, output } from '@angular/core';
import {
  TuiAppearanceOptions,
  TuiButton,
  TuiButtonOptions,
} from '@taiga-ui/core';

@Component({
  selector: 'app-icon-button',
  imports: [TuiButton],
  templateUrl: './icon-button.component.html',
  styleUrl: './icon-button.component.scss',
})
export class IconButtonComponent {
  readonly icon = input('');

  readonly type = input<HTMLButtonElement['type']>('button');
  readonly size = input<TuiButtonOptions['size']>('m');
  readonly appearance = input<TuiAppearanceOptions['appearance']>('primary');

  readonly clicked = output();
}
