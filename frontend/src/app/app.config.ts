import { ApplicationConfig } from '@angular/core';
// Importa provideRouter y withHashLocation
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes'; 

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withHashLocation()) 
  ]
};