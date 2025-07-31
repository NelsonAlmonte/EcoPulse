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
  userForm!: FormGroup;

  ngOnInit(): void {
    this.userForm = this.fb.group<UpdateUserDto>({
      name: '',
      last: '',
    });
  }

  updateUser(): void {
    const loggedUserData = this.authService.loggedUserData();
    const formValue = this.userForm.getRawValue();
    const updateUserDto: UpdateUserDto = {
      name: formValue.name,
      last: formValue.last,
    };
    console.log('object');
    this.userService
      .updateUser(loggedUserData.id, updateUserDto)
      .subscribe((result) => {
        if (result.error) {
          //TODO: Handle error
          console.log(result.error);
        }

        this.userService.user.set(result);
        //TODO: Success toast
        this.router.navigate(['/tabs/profile']);
      });
  }
}
