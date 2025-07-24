import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { ApiResult } from '@core/interfaces/api.interface';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  http = inject(HttpClient);

  doFetch<T = unknown>(url: string): Observable<ApiResult<T>> {
    return this.http.get<T>(url).pipe(
      map((data) => ({ status: 'SUCCESS' as const, data: data, error: null })),
      catchError((err) => {
        console.log(err);
        const errorMessage =
          err?.error?.message || err?.message || 'Unknown error';

        return of({
          status: 'ERROR' as const,
          data: null,
          error: new Error(errorMessage),
        });
      })
    );
  }

  doPost<T = unknown, U = unknown>(
    url: string,
    body: U
  ): Observable<ApiResult<T>> {
    return this.http.post<T>(url, body).pipe(
      map((data) => ({ status: 'SUCCESS' as const, data: data, error: null })),
      catchError((err) => {
        console.log(err);
        const errorMessage =
          err?.error?.message || err?.message || 'Unknown error';

        return of({
          status: 'ERROR' as const,
          data: null,
          error: new Error(errorMessage),
        });
      })
    );
  }
}
