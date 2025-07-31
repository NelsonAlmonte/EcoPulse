import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
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
  imports: [LucideAngularModule],
})
export class ProfileOptionsComponent implements OnInit {
  router = inject(Router);
  authService = inject(AuthService);
  userIcon = CircleUserIcon;
  editProfileIcon = UserCogIcon;
  issuesIcon = FileSearchIcon;
  highlightedIcon = StarIcon;
  changePasswordIcon = KeyRoundIcon;
  logoutIcon = LogOutIcon;

  constructor() {}

  ngOnInit() {}

  navigate(route: string): void {
    this.router.navigate([route]);
  }

  logout(): void {
    this.authService.logout();
  }
}
