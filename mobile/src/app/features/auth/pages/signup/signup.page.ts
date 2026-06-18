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
import { UserService } from '@core/services/user.service';
import { CreateUserDto } from '@shared/dto/user.dto';
import { catchError, switchMap, throwError } from 'rxjs';

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
  userService = inject(UserService);
  router = inject(Router);
  fb = inject(FormBuilder);
  toastController = inject(ToastController);
  loadingController = inject(LoadingController);
  signupForm!: FormGroup;

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      last: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  async signup(): Promise<void> {
    await this.uiService.showLoading('Creando cuenta...');

    const signedupUser = this.signupForm.getRawValue();

    this.authService
      .signup(signedupUser.email, signedupUser.password)
      .pipe(
        catchError((error) => {
          if (error.message?.includes('already registered')) {
            return throwError(() => 'Ya existe una cuenta con ese correo.');
          }

          return throwError(() => 'Ocurrió un error durante el registro.');
        }),
        switchMap((data) => {
          const userToBeCreated: CreateUserDto = {
            id: data.user!.id,
            name: signedupUser.name,
            last: signedupUser.last,
            email: signedupUser.email,
            password: signedupUser.password,
          };

          return this.userService.createUser(userToBeCreated).pipe(
            catchError(() => {
              return throwError(
                () =>
                  'La cuenta fue creada, pero ocurrió un error al guardar el perfil.'
              );
            })
          );
        })
      )
      .subscribe({
        next: async () => {
          await this.uiService.hideLoading();
          this.router.navigate(['/']);
        },
        error: async (message) => {
          await this.uiService.hideLoading();
          await this.uiService.showToast(message);
        },
      });
  }
}
