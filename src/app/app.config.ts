import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { provideHttpClient,HTTP_INTERCEPTORS   }    from '@angular/common/http';

import MyPreset from 'assets/theme/mypreset';

import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { AuthInterceptor } from './core/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),                              
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    provideAnimationsAsync(),
    providePrimeNG({
      theme: { preset: MyPreset }
    })
  ]
};
