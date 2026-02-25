import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { TuiAlertService } from '@taiga-ui/core';
import { catchError } from 'rxjs';

import { API_ERR_MESSAGE } from '../constants/api-err-msg';

export const apiError: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const alertService = inject(TuiAlertService);

  if (!request.url.startsWith('/api')) {
    return next(request);
  }

  const showApiAlert = (msg = API_ERR_MESSAGE): void => {
    alertService
      .open(msg, {
        icon: '@tui.circle-x',
        appearance: 'negative',
      })
      .subscribe();
  };

  return next(request).pipe(
    catchError((err) => {
      showApiAlert();

      throw new Error(err);
    })
  );
};
