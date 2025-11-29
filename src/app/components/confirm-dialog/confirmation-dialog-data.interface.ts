import { TuiAppearanceOptions } from '@taiga-ui/core';

export interface ConfirmationDialogData {
  label?: string;
  content?: string;
  primaryButtonText?: string;
  primaryButtonAppearance?: TuiAppearanceOptions['appearance'];
  secondaryButtonText?: string;
}
