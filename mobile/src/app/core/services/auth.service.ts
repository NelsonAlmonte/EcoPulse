import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiService } from '@core/services/api.service';
import {
  AuthResponseDto,
  LoginUserDto,
  SignupUserDto,
} from '@shared/dto/auth.dto';
import { Router } from '@angular/router';

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
      .doPost<void, SignupUserDto>(`${this.URL}/signup`, signupUserDto)
      .subscribe((result) => {
        console.log(result.error);
        if (result.data) {
          console.log(result.data);
          localStorage.setItem('auth', JSON.stringify(result.data));
          this.router.navigate(['/']);
        }
      });
  }
}
