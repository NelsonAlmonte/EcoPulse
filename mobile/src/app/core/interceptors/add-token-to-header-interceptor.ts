import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@core/services/auth.service';

export const addTokenToHeaderInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const loggedUserData = authService.loggedUserData();

  if (loggedUserData) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${loggedUserData.access_token}`,
      },
    });
  }

  return next(req);
};
