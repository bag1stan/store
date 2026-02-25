import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideEventPlugins } from '@taiga-ui/event-plugins';

import { routes } from './app.routes';
import { apiError } from './shared/interceptors/api-error';
import { apiUrl } from './shared/interceptors/api-url';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([apiError, apiUrl])),
    provideAnimations(),
    provideEventPlugins(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
  ],
};
