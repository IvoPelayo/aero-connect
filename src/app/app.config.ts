import { ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { provideLoadingOnNavigation } from './core/services/loading.service';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';
import { AirportService } from './core/services/airports.service';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDateFormats, provideNativeDateAdapter } from '@angular/material/core';
import { delayInterceptor } from './core/interceptors/delay.interceptor';
import { AuthService } from './core/services/auth.service';

const ES_DATE_FORMATS: MatDateFormats = {
  parse: { dateInput: null },
  display: {
    dateInput: { day: '2-digit', month: '2-digit', year: 'numeric' },
    monthYearLabel: { month: 'long', year: 'numeric' },
    dateA11yLabel: { day: 'numeric', month: 'long', year: 'numeric' },
    monthYearA11yLabel: { month: 'long', year: 'numeric' },
  },
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(
      withInterceptors([
        authInterceptor,
        loadingInterceptor,
        errorInterceptor,
        delayInterceptor
      ])
    ),
    provideAnimationsAsync(),
    provideLoadingOnNavigation(),
    provideAppInitializer(() => {
     // inject(AuthService).logout();
      return inject(AirportService).loadAirports();
    }),
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: MAT_DATE_FORMATS, useValue: ES_DATE_FORMATS },
  ],
};
