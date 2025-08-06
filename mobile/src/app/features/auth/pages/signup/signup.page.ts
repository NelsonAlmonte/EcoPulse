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
import { RouterModule } from '@angular/router';
import { SignupUserDto } from '@shared/dto/auth.dto';
import { AuthService } from '@core/services/auth.service';
import { CheckCircleIcon, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.css'],
  standalone: true,
  imports: [
    IonHeader,
    IonInput,
    IonContent,
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
export class SignupPage implements OnInit {
  private authService = inject(AuthService);
  fb = inject(FormBuilder);
  signupForm!: FormGroup;
  completeSignupIcon = CheckCircleIcon;

  constructor() {}

  ngOnInit() {
    this.signupForm = this.fb.group<SignupUserDto>({
      name: '',
      last: '',
      email: '',
      password: '',
    });
  }

  signup() {
    this.authService.signup(this.signupForm.getRawValue());
  }
}
