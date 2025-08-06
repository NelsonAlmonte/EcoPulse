import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  IonContent,
  IonInput,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
} from '@ionic/angular/standalone';
import { AuthService } from '@core/services/auth.service';
import { RouterModule } from '@angular/router';
import { LoginUserDto } from '@shared/dto/auth.dto';
import { LogInIcon, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.css'],
  imports: [
    IonHeader,
    IonContent,
    IonInput,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    LucideAngularModule,
  ],
})
export class LoginPage implements OnInit {
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  loginForm!: FormGroup;
  loginIcon = LogInIcon;

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
