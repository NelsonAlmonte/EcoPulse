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
    if (this.uiService.hasConnection()) {
      this.getUserProfile();
    }
  }

  refreshUserData(event: RefresherCustomEvent): void {
    this.getUserProfile();

    setTimeout(() => {
      event.target.complete();
    }, 1500);
  }

  getUserProfile(): void {
    const userId = this.authService.loggedUserData()!.id;

    this.userService.isLoading.set(true);

    this.userService.loadProfile(userId).subscribe({
      error: async () => {
        await this.uiService.showToast(
          'Ocurrió un error al obtener tus datos.'
        );
      },
      complete: () => this.userService.isLoading.set(false),
    });
  }
}
