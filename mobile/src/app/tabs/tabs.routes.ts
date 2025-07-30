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
        loadComponent: () =>
          import('../features/profile/profile.page').then((m) => m.ProfilePage),
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
