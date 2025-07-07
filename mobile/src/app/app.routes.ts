import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'map',
    loadComponent: () => import('./features/map/map.page').then( m => m.MapPage)
  },
  {
    path: 'report',
    loadComponent: () => import('./features/report/report.page').then( m => m.ReportPage)
  },
];
