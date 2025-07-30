import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { catchError, EMPTY, switchMap, throwError } from 'rxjs';

const RETRY_HEADER = 'x-refresh-retry';

export const refreshTokenInterceptorInterceptor: HttpInterceptorFn = (
  req,
  next
) => {
  const authService = inject(AuthService);
  const loggedUserData = authService.loggedUserData();

  return next(req).pipe(
    catchError((error) => {
      const alreadyRetried = req.headers.has(RETRY_HEADER);

      if (
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        loggedUserData &&
        !alreadyRetried
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
                  headers: req.headers.set(RETRY_HEADER, '1'),
                });

                return next(retryReq);
              }

              authService.logout();
              return EMPTY;
            }),
            catchError(() => {
              authService.logout();
              return EMPTY;
            })
          );
      }

      return throwError(() => error);
    })
  );
};
