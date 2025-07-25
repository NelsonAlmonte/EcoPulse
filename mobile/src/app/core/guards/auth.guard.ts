import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthResponseDto } from '@shared/dto/auth.dto';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authData = localStorage.getItem('auth');

  if (!authData) {
    router.navigate(['/login']);
    return false;
  }

  const parsedData: AuthResponseDto = JSON.parse(authData);

  if (!parsedData.access_token) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
