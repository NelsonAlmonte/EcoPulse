import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { OfflineService } from '@core/services/offline.service';
import { UserService } from '@core/services/user.service';
import { IonRippleEffect, IonBadge } from '@ionic/angular/standalone';
import {
  ArchiveIcon,
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
  imports: [IonRippleEffect, LucideAngularModule, IonBadge],
})
export class ProfileOptionsComponent {
  router = inject(Router);
  authService = inject(AuthService);
  userService = inject(UserService);
  offlineService = inject(OfflineService);
  userIcon = CircleUserIcon;
  editProfileIcon = UserCogIcon;
  issuesIcon = FileSearchIcon;
  highlightedIcon = StarIcon;
  changePasswordIcon = KeyRoundIcon;
  logoutIcon = LogOutIcon;
  savedIssuesIcon = ArchiveIcon;

  navigate(route: string): void {
    this.router.navigate([route]);
  }

  logout(): void {
    this.userService.resetSignals();
    this.authService.logout();
  }
}
