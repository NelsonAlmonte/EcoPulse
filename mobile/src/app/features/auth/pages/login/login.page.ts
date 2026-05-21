import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Browser } from '@capacitor/browser';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonContent, IonInput } from '@ionic/angular/standalone';
import { AuthService } from '@core/services/auth.service';
import { RouterModule } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.css'],
  imports: [
    IonContent,
    IonInput,
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
  ],
})
export class LoginPage implements OnInit {
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  loginForm!: FormGroup;

  constructor() {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login() {
    this.authService.login(this.loginForm.getRawValue());
  }

  async forgotPassword() {
    await Browser.open({ url: environment.forgotPasswordUrl });
  }
}
