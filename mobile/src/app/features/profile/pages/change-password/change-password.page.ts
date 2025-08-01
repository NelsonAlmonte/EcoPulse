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
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonInput,
} from '@ionic/angular/standalone';
import { AuthService } from '@core/services/auth.service';
import { ChangePasswordDto } from '@shared/dto/auth.dto';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.css'],
  imports: [
    IonButtons,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonInput,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class ChangePasswordPage implements OnInit {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  passwordForm!: FormGroup;

  ngOnInit(): void {
    this.passwordForm = this.fb.group<ChangePasswordDto>({
      current_password: '',
      new_password: '',
    });
  }

  updatePassword(): void {}
}
