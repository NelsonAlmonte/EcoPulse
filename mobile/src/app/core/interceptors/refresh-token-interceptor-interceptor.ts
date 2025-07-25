import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { catchError, EMPTY, switchMap, throwError } from 'rxjs';

export const refreshTokenInterceptorInterceptor: HttpInterceptorFn = (
  req,
  next
) => {
  const authService = inject(AuthService);
  const loggedUserData = authService.loggedUserData();
  //TODO: Arreglar esto. NEcesita el token para refrescar la sesion
  return next(req).pipe(
    catchError((error) => {
      if (
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        loggedUserData
      ) {
        return authService
          .refreshSession({ refresh_token: loggedUserData.refresh_token })
          .pipe(
            switchMap((result) => {
              if (result.data) {
                localStorage.setItem('auth', JSON.stringify(result.data));

                const retryReq = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${result.data.access_token}`,
                  },
                });

                return next(retryReq);
              }

              authService.logout();
              return EMPTY;
            })
          );
      }

      return throwError(() => error);
    })
  );
};
