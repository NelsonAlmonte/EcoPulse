import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  doFetch<T>(url: string): Observable<T> {
    return this.http.get<T>(url).pipe(
      catchError((err) => {
        console.error('GET error:', err);
        return throwError(() => err);
      })
    );
  }

  doPost<T = unknown, U = unknown>(url: string, body: U): Observable<T> {
    return this.http.post<T>(url, body).pipe(
      catchError((err) => {
        console.error('POST error:', err);
        return throwError(() => err);
      })
    );
  }

  doPut<T = unknown, U = unknown>(url: string, body: U): Observable<T> {
    return this.http.put<T>(url, body).pipe(
      catchError((err) => {
        console.error('PUT error:', err);
        return throwError(() => err);
      })
    );
  }

  doDelete<T = unknown>(url: string): Observable<T> {
    return this.http.delete<T>(url).pipe(
      catchError((err) => {
        console.error('DELETE error:', err);
        return throwError(() => err);
      })
    );
  }
}
