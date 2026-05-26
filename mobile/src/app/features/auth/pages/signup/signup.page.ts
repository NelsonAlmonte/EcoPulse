import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
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
import { UiService } from '@core/services/ui.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.css'],
  standalone: true,
  imports: [
    IonInput,
    IonContent,
    IonRippleEffect,
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
  ],
})
export class SignupPage implements OnInit {
  authService = inject(AuthService);
  uiService = inject(UiService);
  router = inject(Router);
  fb = inject(FormBuilder);
  toastController = inject(ToastController);
  loadingController = inject(LoadingController);
  signupForm!: FormGroup;

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      last: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  async signup(): Promise<void> {
    await this.uiService.showLoading('Creando cuenta...');

    this.authService.signup(this.signupForm.getRawValue()).subscribe({
      next: async (response) => {
        await this.uiService.hideLoading();

        localStorage.setItem('auth', JSON.stringify(response));

        this.router.navigate(['/']);
      },
      error: async (err) => {
        await this.uiService.hideLoading();

        await this.uiService.showToast(err.error.message);
      },
    });
  }
}
