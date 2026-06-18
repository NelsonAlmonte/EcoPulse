import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonInput,
  IonRippleEffect,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular/standalone';
import { UpdateUserDto } from '@shared/dto/user.dto';
import { AuthService } from '@core/services/auth.service';
import { UserService } from '@core/services/user.service';
import { UiService } from '@core/services/ui.service';
import {
  ArrowLeft,
  CheckCircleIcon,
  LucideAngularModule,
  UserCogIcon,
} from 'lucide-angular';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.css'],
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonInput,
    IonFooter,
    IonRippleEffect,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LucideAngularModule,
    RouterLink,
  ],
})
export class EditProfilePage implements OnInit {
  fb = inject(FormBuilder);
  router = inject(Router);
  authService = inject(AuthService);
  userService = inject(UserService);
  uiService = inject(UiService);
  toastController = inject(ToastController);
  userForm!: FormGroup;
  backIcon = ArrowLeft;
  editProfileIcon = UserCogIcon;
  completeEditProfileIcon = CheckCircleIcon;

  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      last: ['', Validators.required],
    });
  }

  async updateUser(): Promise<void> {
    if (!this.uiService.hasConnection()) return;

    const formValue = this.userForm.getRawValue();
    const updateUserDto: UpdateUserDto = {
      name: formValue.name,
      last: formValue.last,
    };

    this.userService
      .updateUser(this.authService.user()!.id, updateUserDto)
      .subscribe({
        next: async (result) => {
          this.userService.user.set(result);

          await this.uiService.showToast(
            'Tu perfil se actualizo correctamente.'
          );

          this.router.navigate(['/tabs/profile']);
        },
        error: async () => {
          await this.uiService.showToast(
            'Ocurrió un error al actualizar tu perfil.'
          );
        },
      });
  }
}
