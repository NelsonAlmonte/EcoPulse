import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
import { UiService } from '@core/services/ui.service';
import { forkJoin } from 'rxjs';

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
export class ProfilePage {
  router = inject(Router);
  authService = inject(AuthService);
  userService = inject(UserService);
  uiService = inject(UiService);

  ionViewWillEnter(): void {
    if (!this.userService.user()) {
      this.getUserProfile();
    }
  }

  refreshUserData(event: RefresherCustomEvent): void {
    this.getUserProfile();

    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  getUserProfile(): void {
    const userId = this.authService.loggedUserData()!.id;

    this.userService.isLoading.set(true);

    forkJoin({
      user: this.userService.getUser(userId),
      issues: this.userService.countUserIssues(userId),
      highlightsGiven: this.userService.counthighlightsGiven(userId),
      highlightsReceived: this.userService.counthighlightsReceived(userId),
    }).subscribe({
      next: (response) => {
        this.userService.user.set(response.user);
        this.userService.counters.set({
          issues: Number(response.issues),
          highlightsGiven: Number(response.highlightsGiven),
          highlightsReceived: Number(response.highlightsReceived),
        });
      },
      error: async () => {
        await this.uiService.showToast(
          'Ocurrió un error al obtener tus datos.',
        );
      },
      complete: () => this.userService.isLoading.set(false),
    });
  }
}
