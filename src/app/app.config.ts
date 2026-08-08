// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import {
  provideRouter,
  TitleStrategy,
  withComponentInputBinding,
  withHashLocation,
  withRouterConfig,
} from '@angular/router';
import { routes } from './app.routes';
import { RouterTitleStrategy } from './core/services/router-title-strategy';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withHashLocation(),
      withComponentInputBinding(),
      withRouterConfig({ scrollPositionRestoration: 'top' })
    ),
    { provide: TitleStrategy, useClass: RouterTitleStrategy },
  ],
};
