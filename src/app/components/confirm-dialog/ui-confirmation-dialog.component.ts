import { Component } from '@angular/core';
import { TuiButton, TuiDialogContext } from '@taiga-ui/core';
import { injectContext } from '@taiga-ui/polymorpheus';

import { ConfirmationDialogData } from './confirmation-dialog-data.interface';

@Component({
  selector: 'main-ui-confirmation-dialog',
  imports: [TuiButton],
  templateUrl: './ui-confirmation-dialog.component.html',
})
export class UiConfirmationDialogComponent {
  readonly context =
    injectContext<
      TuiDialogContext<boolean | undefined, ConfirmationDialogData | undefined>
    >();

  onPrimaryButtonClick(): void {
    this.context.completeWith(true);
  }

  onSecondaryButtonClick(): void {
    this.context.completeWith(false);
  }
}
