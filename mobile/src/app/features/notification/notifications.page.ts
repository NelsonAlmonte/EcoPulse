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
import {
  ArrowLeft,
  FolderOpenIcon,
  LucideAngularModule,
  WifiOffIcon,
} from 'lucide-angular';
import { NotificationService } from '@core/services/notification.service';
import { AuthService } from '@core/services/auth.service';
import { UiService } from '@core/services/ui.service';
import { IssueDetailLoadingComponent } from '@shared/components/issue-detail-loading/issue-detail-loading.component';
import { AlertComponent } from '@shared/components/alert/alert.component';
import { NotificationItemComponent } from './components/notification-item/notification-item.component';

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
    IssueDetailLoadingComponent,
    AlertComponent,
    NotificationItemComponent,
  ],
})
export class NotificationsPage implements OnInit {
  route = inject(ActivatedRoute);
  notificationService = inject(NotificationService);
  authService = inject(AuthService);
  uiService = inject(UiService);
  pageFrom = '';
  backIcon = ArrowLeft;
  noConnectionIcon = WifiOffIcon;
  emptyIcon = FolderOpenIcon;

  async ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      const page = params.get('from');

      if (!page) this.pageFrom = '/tabs/profile';

      this.pageFrom = params.get('from')!;
    });

    this.notificationService.hasNewNotification.set(false);

    localStorage.removeItem('hasNewNotification');

    await this.getNotifications();
  }

  async getNotifications(): Promise<void> {
    this.notificationService.resetSignals();
    this.notificationService.isLoading.set(true);

    const user = this.authService.user();

    if (!user) {
      await this.uiService.showToast('Ocurrió un error al obtener tus datos.');

      return;
    }

    this.notificationService.getNotifications(user.id).subscribe({
      next: (response) => {
        this.notificationService.notificationList.set(response);
        console.log(response);
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
