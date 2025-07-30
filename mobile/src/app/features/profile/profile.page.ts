import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { ProfileDetailComponent } from '@features/profile/components/profile-detail/profile-detail.component';
import { AuthService } from '@core/services/auth.service';
import { UserService } from '@core/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.css'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    ProfileDetailComponent,
  ],
})
export class ProfilePage implements OnInit {
  authService = inject(AuthService);
  userService = inject(UserService);

  ngOnInit(): void {
    this.userService.getUser(this.authService.loggedUserData().id);
  }
}
