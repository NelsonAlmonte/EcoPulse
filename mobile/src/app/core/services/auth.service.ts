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
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiService = inject(ApiService);
  private router = inject(Router);
  private URL = `${environment.apiUrl}auth`;

  login(loginUserDto: LoginUserDto): Observable<AuthResponseDto> {
    return this.apiService.doPost<AuthResponseDto, LoginUserDto>(
      `${this.URL}/login`,
      loginUserDto
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
