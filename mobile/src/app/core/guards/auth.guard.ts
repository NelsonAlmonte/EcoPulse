import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const { data } = await authService.supabase.auth.getSession();

  if (!data.session) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
