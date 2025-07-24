import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { IonContent, IonInput } from '@ionic/angular/standalone';
import { AuthService } from '@core/services/auth.service';
import { RouterModule } from '@angular/router';
import { LoginUserDto } from '@shared/dto/auth.dto';

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
    this.loginForm = this.fb.group<LoginUserDto>({
      email: '',
      password: '',
    });
  }

  login() {
    this.authService.login(this.loginForm.getRawValue());
  }
}
