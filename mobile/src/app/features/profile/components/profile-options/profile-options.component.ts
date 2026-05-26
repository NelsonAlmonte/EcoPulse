import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { UserService } from '@core/services/user.service';
import { IonRippleEffect } from '@ionic/angular/standalone';
import {
  CircleUserIcon,
  FileSearchIcon,
  KeyRoundIcon,
  LogOutIcon,
  LucideAngularModule,
  StarIcon,
  UserCogIcon,
} from 'lucide-angular';

@Component({
  selector: 'app-profile-options',
  templateUrl: './profile-options.component.html',
  styleUrls: ['./profile-options.component.css'],
  imports: [IonRippleEffect, LucideAngularModule],
})
export class ProfileOptionsComponent {
  router = inject(Router);
  authService = inject(AuthService);
  userService = inject(UserService);
  userIcon = CircleUserIcon;
  editProfileIcon = UserCogIcon;
  issuesIcon = FileSearchIcon;
  highlightedIcon = StarIcon;
  changePasswordIcon = KeyRoundIcon;
  logoutIcon = LogOutIcon;

  navigate(route: string): void {
    this.router.navigate([route]);
  }

  logout(): void {
    this.userService.resetSignals();
    this.authService.logout();
  }
}
