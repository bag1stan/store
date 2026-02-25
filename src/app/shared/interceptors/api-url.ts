import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';

import { API_URL } from '../constants/api-url';

export const apiUrl: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  if (!request.url.startsWith('/api')) {
    return next(request);
  }

  const path = request.url.replace('/api', '');

  return next(
    request.clone({
      url: API_URL + path,
    })
  );
};
