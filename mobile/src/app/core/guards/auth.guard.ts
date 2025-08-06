import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const userData = authService.loggedUserData();
  if (!userData) {
    router.navigate(['/welcome']);
    return false;
  }

  return true;
};
