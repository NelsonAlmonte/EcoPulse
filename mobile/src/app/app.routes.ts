import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
    canActivate: [authGuard],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./features/auth/pages/signup/signup.page').then(
        (m) => m.SignupPage
      ),
  },
  {
    path: 'edit-profile',
    loadComponent: () =>
      import('./features/profile/pages/edit-profile/edit-profile.page').then(
        (m) => m.EditProfilePage
      ),
    canActivate: [authGuard],
  },
  {
    path: 'user-issues',
    loadComponent: () =>
      import('./features/profile/pages/user-issues/user-issues.page').then(
        (m) => m.UserIssuesPage
      ),
    canActivate: [authGuard],
  },
  {
    path: 'highlights-given',
    loadComponent: () =>
      import(
        './features/profile/pages/highlights-given/highlights-given.page'
      ).then((m) => m.HighlightsGivenPage),
    canActivate: [authGuard],
  },
  {
    path: 'offline-issues',
    loadComponent: () =>
      import(
        './features/profile/pages/offline-issues/offline-issues.page'
      ).then((m) => m.OfflineIssuesPage),
    canActivate: [authGuard],
  },
  {
    path: 'notifications',
    loadComponent: () =>
      import('./features/profile/pages/notifications/notifications.page').then(
        (m) => m.NotificationsPage
      ),
    canActivate: [authGuard],
  },
];
