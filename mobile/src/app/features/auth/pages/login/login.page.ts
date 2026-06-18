import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Browser } from '@capacitor/browser';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonContent,
  IonInput,
  IonRippleEffect,
  LoadingController,
  ToastController,
} from '@ionic/angular/standalone';
import { AuthService } from '@core/services/auth.service';
import { environment } from 'src/environments/environment';
import { UiService } from '@core/services/ui.service';
import { switchMap } from 'rxjs';
import { UserService } from '@core/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.css'],
  imports: [
    IonContent,
    IonInput,
    IonRippleEffect,
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
  ],
})
export class LoginPage implements OnInit {
  authService = inject(AuthService);
  uiService = inject(UiService);
  userService = inject(UserService);
  router = inject(Router);
  fb = inject(FormBuilder);
  toastController = inject(ToastController);
  loadingController = inject(LoadingController);
  loginForm!: FormGroup;

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  async login(): Promise<void> {
    await this.uiService.showLoading('Iniciando sesión...');

    const loggedUser = this.loginForm.getRawValue();

    this.authService
      .login(loggedUser.email, loggedUser.password)
      .pipe(
        switchMap(() =>
          this.userService.loadProfile(this.authService.user()!.id)
        )
      )
      .subscribe({
        next: async () => {
          await this.uiService.hideLoading();

          this.router.navigate(['/']);
        },
        error: async (err) => {
          await this.uiService.hideLoading();
          await this.uiService.showToast('Credenciales invalidas.');
        },
      });
  }

  async forgotPassword(): Promise<void> {
    await Browser.open({ url: environment.forgotPasswordUrl });
  }
}
