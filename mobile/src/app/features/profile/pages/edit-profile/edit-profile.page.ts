import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular/standalone';
import { UpdateUserDto } from '@shared/dto/user.dto';
import { AuthService } from '@core/services/auth.service';
import { UserService } from '@core/services/user.service';
import { Router } from '@angular/router';

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
    IonBackButton,
    IonInput,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class EditProfilePage implements OnInit {
  fb = inject(FormBuilder);
  router = inject(Router);
  authService = inject(AuthService);
  userService = inject(UserService);
  toastController = inject(ToastController);
  userForm!: FormGroup;

  ngOnInit(): void {
    this.userForm = this.fb.group<UpdateUserDto>({
      name: '',
      last: '',
    });
  }

  async updateUser(): Promise<void> {
    const loggedUserData = this.authService.loggedUserData();
    const formValue = this.userForm.getRawValue();
    const updateUserDto: UpdateUserDto = {
      name: formValue.name,
      last: formValue.last,
    };
    let toast = await this.toastController.create({
      message: 'Tu perfil se actualizo correctamente.',
      duration: 4000,
      position: 'bottom',
      animated: true,
    });

    this.userService
      .updateUser(loggedUserData.id, updateUserDto)
      .subscribe(async (result) => {
        if (result.error) {
          console.log(result.error);
          toast = await this.toastController.create({
            message: 'Ocurrió un error al actualizar tu perfil.',
            duration: 4000,
            position: 'bottom',
            animated: true,
          });

          return;
        }

        this.userService.user.set(result);
        toast.present();
        this.router.navigate(['/tabs/profile']);
      });
  }
}
