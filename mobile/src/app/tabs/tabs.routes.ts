import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'map',
        loadComponent: () =>
          import('../features/map/map.page').then((m) => m.MapPage),
      },
      {
        path: 'report',
        loadComponent: () =>
          import('../features/report/report.page').then((m) => m.ReportPage),
      },
      {
        path: 'profile',
        loadComponent: () => import('./tab3/tab3.page').then((m) => m.Tab3Page),
      },
      {
        path: '',
        redirectTo: 'map',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: 'tabs',
    pathMatch: 'full',
  },
];
