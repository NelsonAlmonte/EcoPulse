import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  doFetch<T>(url: string): Observable<T> {
    return this.http.get<T>(url);
  }

  doPost<T = unknown, U = unknown>(url: string, body: U): Observable<T> {
    return this.http.post<T>(url, body);
  }

  doPut<T = unknown, U = unknown>(url: string, body: U): Observable<T> {
    return this.http.put<T>(url, body);
  }

  doDelete<T = unknown>(url: string): Observable<T> {
    return this.http.delete<T>(url);
  }
}
