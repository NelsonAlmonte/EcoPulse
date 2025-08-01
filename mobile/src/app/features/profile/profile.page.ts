import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
  RefresherCustomEvent,
} from '@ionic/angular/standalone';
import { ProfileDetailComponent } from '@features/profile/components/profile-detail/profile-detail.component';
import { AuthService } from '@core/services/auth.service';
import { UserService } from '@core/services/user.service';
import { Router } from '@angular/router';

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
    IonRefresher,
    IonRefresherContent,
    CommonModule,
    FormsModule,
    ProfileDetailComponent,
  ],
})
export class ProfilePage implements OnInit {
  router = inject(Router);
  authService = inject(AuthService);
  userService = inject(UserService);

  ngOnInit(): void {
    this.userService.getUser(this.authService.loggedUserData().id);
  }

  refreshCounters(event: RefresherCustomEvent): void {
    this.userService.countUserIssues(this.authService.loggedUserData().id);
    this.userService.counthighlightsGiven(this.authService.loggedUserData().id);
    this.userService.counthighlightsReceived(
      this.authService.loggedUserData().id
    );

    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }
}
