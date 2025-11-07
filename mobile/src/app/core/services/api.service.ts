import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { ApiPayload, ApiResult } from '@core/interfaces/api.interface';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  http = inject(HttpClient);

  doFetch<T>(url: string): Observable<ApiResult<T>> {
    return this.http.get<ApiPayload<T>>(url).pipe(
      map((response) => ({
        status: 'SUCCESS' as const,
        result: response,
        error: null,
      })),
      catchError((err) => {
        console.log(err);
        return of({
          status: 'ERROR' as const,
          result: {
            data: null,
          },
          error: err.error,
        });
      })
    );
  }

  doPost<T = unknown, U = unknown>(
    url: string,
    body: U
  ): Observable<ApiResult<T>> {
    return this.http.post<ApiPayload<T>>(url, body).pipe(
      map((response) => ({
        status: 'SUCCESS' as const,
        result: response,
        error: null,
      })),
      catchError((err) => {
        console.log(err);
        return of({
          status: 'ERROR' as const,
          result: {
            data: null,
          },
          error: err.error,
        });
      })
    );
  }

  doDelete<T = unknown>(url: string): Observable<ApiResult<T>> {
    return this.http.delete<ApiPayload<T>>(url).pipe(
      map((response) => ({
        status: 'SUCCESS' as const,
        result: response,
        error: null,
      })),
      catchError((err) => {
        console.log(err);
        return of({
          status: 'ERROR' as const,
          result: {
            data: null,
          },
          error: err.error,
        });
      })
    );
  }

  doPut<T = unknown, U = unknown>(
    url: string,
    body: U
  ): Observable<ApiResult<T>> {
    return this.http.put<ApiPayload<T>>(url, body).pipe(
      map((response) => ({
        status: 'SUCCESS' as const,
        result: response,
        error: null,
      })),
      catchError((err) => {
        console.log(err);
        return of({
          status: 'ERROR' as const,
          result: {
            data: null,
          },
          error: err.error,
        });
      })
    );
  }

  isPaginated<T>(data: any): data is ApiPayload<T> {
    return data && typeof data === 'object' && 'pagination' in data;
  }
}
