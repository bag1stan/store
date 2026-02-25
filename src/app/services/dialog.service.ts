import { inject, Injectable, Injector } from '@angular/core';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { filter } from 'rxjs';

import { AddOneDialogComponent } from '../components/add-one-dialog/add-one-dialog.component';
import { SellDialogComponent } from '../components/cell-dialog/sell-dialog.component';
import { UiConfirmationDialogComponent } from '../components/confirm-dialog/ui-confirmation-dialog.component';
import { Product } from '../interfaces/product.interface';

@Injectable()
export class DialogService {
  private readonly injector = inject(Injector);
  private readonly dialogs = inject(TuiDialogService);

  openAddDialog() {
    return this.dialogs
      .open<Product>(new PolymorpheusComponent(AddOneDialogComponent, this.injector), {
        label: 'Добавление товара',
        size: 's',
      }).pipe(filter(Boolean))
  }

  openEditDialog(product: Product) {
    return this.dialogs
      .open<Product>(new PolymorpheusComponent(AddOneDialogComponent, this.injector), {
        data: product,
        label: 'Редактирование товара',
        size: 's',
      }).pipe(filter(Boolean))
  }

  openDeleteDialog(title: Product['title']) {
    return this.dialogs.open(new PolymorpheusComponent(UiConfirmationDialogComponent, this.injector), {
      label: 'Подтверждение удаления',
      size: 's',
      dismissible: false,
      data: {
        content: `Уверен что хочешь удалить «${title}»?`,
        primaryButtonText: 'Базар',
        secondaryButtonText: 'Не, это я зря быканул',
      }
    }).pipe(filter(Boolean))
  }

  openCellDialog() {
    return this.dialogs
      .open(new PolymorpheusComponent(SellDialogComponent, this.injector), {
        size: 'page',
        label: 'Склад'
      }).pipe(filter(Boolean))
  }
}
