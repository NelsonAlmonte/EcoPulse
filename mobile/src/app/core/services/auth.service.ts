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
import { ApiResult } from '@core/interfaces/api.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiService = inject(ApiService);
  private router = inject(Router);
  private URL = `${environment.apiUrl}auth`;

  login(loginUserDto: LoginUserDto): void {
    this.apiService
      .doPost<AuthResponseDto, LoginUserDto>(`${this.URL}/login`, loginUserDto)
      .subscribe((result) => {
        console.log(result.error);
        if (result.data) {
          console.log(result.data);
          localStorage.setItem('auth', JSON.stringify(result.data));
          this.router.navigate(['/']);
        }
      });
  }

  signup(signupUserDto: SignupUserDto): void {
    this.apiService
      .doPost<AuthResponseDto, SignupUserDto>(
        `${this.URL}/signup`,
        signupUserDto
      )
      .subscribe((result) => {
        console.log(result.error);
        if (result.data) {
          console.log(result.data);
          localStorage.setItem('auth', JSON.stringify(result.data));
          this.router.navigate(['/']);
        }
      });
  }

  refreshSession(
    refreshToken: RefreshUserSessionDto
  ): Observable<ApiResult<AuthResponseDto>> {
    return this.apiService.doPost<AuthResponseDto, RefreshUserSessionDto>(
      `${this.URL}/refresh`,
      refreshToken
    );
  }

  logout(): void {
    localStorage.removeItem('auth');
    this.router.navigate(['/login']);
  }

  loggedUserData(): AuthResponseDto {
    const authData = localStorage.getItem('auth');
    const parsedData: AuthResponseDto = JSON.parse(authData!);
    return parsedData;
  }
}
