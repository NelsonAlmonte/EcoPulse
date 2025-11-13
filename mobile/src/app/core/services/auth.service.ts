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
import { ToastController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiService = inject(ApiService);
  private router = inject(Router);
  private toastController = inject(ToastController);
  private URL = `${environment.apiUrl}auth`;

  login(loginUserDto: LoginUserDto): void {
    this.apiService
      .doPost<AuthResponseDto, LoginUserDto>(`${this.URL}/login`, loginUserDto)
      .subscribe(async (response) => {
        // if (response.error) {
        //   console.log(response.error);
        //   const toast = await this.toastController.create({
        //     message: response.error.message,
        //     duration: 6000,
        //     position: 'bottom',
        //     animated: true,
        //   });

        //   toast.present();

        //   this.router.navigate(['/login']);

        //   return;
        // }

        // if (!isPaginated(response.result)) {
        localStorage.setItem('auth', JSON.stringify(response));
        this.router.navigate(['/']);
        // }
      });
  }

  signup(signupUserDto: SignupUserDto): void {
    this.apiService
      .doPost<AuthResponseDto, SignupUserDto>(
        `${this.URL}/signup`,
        signupUserDto
      )
      .subscribe(async (response) => {
        // if (response.error) {
        //   console.log(response.error);
        //   const toast = await this.toastController.create({
        //     message: response.error.message,
        //     duration: 6000,
        //     position: 'bottom',
        //     animated: true,
        //   });

        //   toast.present();

        //   this.router.navigate(['/signup']);

        //   return;
        // }

        // if (!isPaginated(response.result)) {
        localStorage.setItem('auth', JSON.stringify(response));
        this.router.navigate(['/']);
        // }
      });
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
    this.router.navigate(['/welcome']);
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
