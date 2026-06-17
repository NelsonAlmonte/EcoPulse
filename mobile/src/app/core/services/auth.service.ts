import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiService } from '@core/services/api.service';
import {
  AuthResponseDto,
  LoginUserDto,
  RefreshUserSessionDto,
  SignupUserDto,
} from '@shared/dto/auth.dto';
import { Router } from '@angular/router';
import { from, Observable, of, switchMap, throwError } from 'rxjs';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiService = inject(ApiService);
  private router = inject(Router);
  private URL = `${environment.apiUrl}auth`;
  private supabase!: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabasePublishableKey
    );
  }

  login(loginUserDto: LoginUserDto) {
    return from(
      this.supabase.auth.signInWithPassword({
        email: loginUserDto.email,
        password: loginUserDto.password,
      })
    ).pipe(
      switchMap(({ data, error }) => {
        if (error) {
          return throwError(() => error);
        }

        return of(data);
      })
    );
  }

  signup(signupUserDto: SignupUserDto): Observable<AuthResponseDto> {
    return this.apiService.doPost<AuthResponseDto, SignupUserDto>(
      `${this.URL}/signup`,
      signupUserDto
    );
  }

  refreshSession(
    refreshToken: RefreshUserSessionDto
  ): Observable<AuthResponseDto> {
    return this.apiService.doPost<AuthResponseDto, RefreshUserSessionDto>(
      `${this.URL}/refresh`,
      refreshToken
    );
  }

  logout(): void {
    localStorage.removeItem('auth');
    localStorage.removeItem('user');
    localStorage.removeItem('issues');
    this.router.navigate(['/login']);
  }

  loggedUserData(): AuthResponseDto | null {
    const authData = localStorage.getItem('auth');

    if (!authData) return null;

    try {
      const parsedData: AuthResponseDto = JSON.parse(authData);

      if (
        !parsedData.access_token ||
        typeof parsedData.access_token !== 'string'
      ) {
        this.logout();
        return null;
      }

      return parsedData;
    } catch (error) {
      console.warn('Error parsing auth data:', error);

      this.logout();
      return null;
    }
  }
}
