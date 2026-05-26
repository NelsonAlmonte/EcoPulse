import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
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
  router = inject(Router);
  fb = inject(FormBuilder);
  toastController = inject(ToastController);
  loadingController = inject(LoadingController);
  loginForm!: FormGroup;

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  async login(): Promise<void> {
    await this.uiService.showLoading('Iniciando sesión...');

    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: async (response) => {
        await this.uiService.hideLoading();

        localStorage.setItem('auth', JSON.stringify(response));

        this.router.navigate(['/']);
      },
      error: async (err: HttpErrorResponse) => {
        await this.uiService.hideLoading();

        await this.uiService.showToast(err.error.message);
      },
    });
  }

  async forgotPassword(): Promise<void> {
    await Browser.open({ url: environment.forgotPasswordUrl });
  }
}
