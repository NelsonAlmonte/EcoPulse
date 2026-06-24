import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonRippleEffect,
} from '@ionic/angular/standalone';
import { ArrowLeft, LucideAngularModule } from 'lucide-angular';
import { NotificationService } from '@core/services/notification.service';
import { AuthService } from '@core/services/auth.service';
import { UiService } from '@core/services/ui.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.css'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonRippleEffect,
    LucideAngularModule,
    CommonModule,
    RouterLink,
  ],
})
export class NotificationsPage implements OnInit {
  route = inject(ActivatedRoute);
  notificationService = inject(NotificationService);
  authService = inject(AuthService);
  uiService = inject(UiService);
  pageFrom = '';
  backIcon = ArrowLeft;

  async ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      const page = params.get('from');

      if (!page) this.pageFrom = '/tabs/profile';

      this.pageFrom = params.get('from')!;
    });

    this.notificationService.hasNewNotification.set(false);

    localStorage.removeItem('hasNewNotification');

    await this.getNotification();
  }

  async getNotification(): Promise<void> {
    this.notificationService.notifications.set([]);
    this.notificationService.isLoading.set(true);

    const user = this.authService.user();

    if (!user) {
      await this.uiService.showToast('Ocurrió un error al obtener tus datos.');

      return;
    }

    this.notificationService.getNotifications(user.id).subscribe({
      next: (response) => {
        this.notificationService.notifications.set(response);
      },
      error: async () => {
        await this.uiService.showToast(
          'Ocurrió un error al obtener tus datos.'
        );
      },
      complete: () => this.notificationService.isLoading.set(false),
    });
  }
}
