import { bootstrapApplication } from '@angular/platform-browser';
import { enableProdMode } from '@angular/core';
import {
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
  PreloadAllModules,
} from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { environment } from './environments/environment';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { refreshTokenInterceptorInterceptor } from '@core/interceptors/refresh-token-interceptor-interceptor';
import { addTokenToHeaderInterceptor } from '@core/interceptors/add-token-to-header-interceptor';

defineCustomElements(window);
if (environment.production) {
  enableProdMode();
}
bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular({ useSetInputAPI: true }),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        addTokenToHeaderInterceptor,
        refreshTokenInterceptorInterceptor,
      ])
    ),
  ],
});
