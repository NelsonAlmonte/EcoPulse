import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { AuthResponseDto } from '@shared/dto/auth.dto';
import { catchError, EMPTY, switchMap, throwError } from 'rxjs';

const MAX_RETRIES = 1;
const retryCounts = new Map<string, number>();

export const refreshTokenInterceptorInterceptor: HttpInterceptorFn = (
  req,
  next
) => {
  const authService = inject(AuthService);
  const loggedUserData = authService.loggedUserData();

  return next(req).pipe(
    catchError((error) => {
      const url = req.url;
      const currentRetry = retryCounts.get(url) || 0;

      if (
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        loggedUserData &&
        currentRetry < MAX_RETRIES
      ) {
        retryCounts.set(url, currentRetry + 1);

        return authService
          .refreshSession({ refresh_token: loggedUserData.refresh_token })
          .pipe(
            switchMap((response) => {
              let auth = {} as AuthResponseDto;

              if (!response) {
                authService.logout();
                return EMPTY;
              }

              auth = response;

              localStorage.setItem('auth', JSON.stringify(response));

              const retryReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${auth.access_token}`,
                },
              });

              return next(retryReq);
            }),
            catchError(() => {
              authService.logout();
              return EMPTY;
            })
          );
      }

      retryCounts.delete(url);
      return throwError(() => error);
    })
  );
};
