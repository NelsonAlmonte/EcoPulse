import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonRippleEffect,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
} from '@ionic/angular/standalone';
import { RefresherCustomEvent } from '@ionic/core';
import {
  ArrowLeft,
  ChevronDown,
  FolderOpenIcon,
  LucideAngularModule,
  WifiOffIcon,
} from 'lucide-angular';
import { NotificationService } from '@core/services/notification.service';
import { AuthService } from '@core/services/auth.service';
import { UiService } from '@core/services/ui.service';
import { AlertComponent } from '@shared/components/alert/alert.component';
import { NotificationItemComponent } from './components/notification-item/notification-item.component';
import { NotificationLoadingComponent } from '@shared/components/notification-loading/notification-loading.component';
import { List } from '@shared/models/response.model';
import { Notification } from '@shared/models/notification.model';

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
    IonRefresher,
    IonRefresherContent,
    IonSpinner,
    LucideAngularModule,
    CommonModule,
    RouterLink,
    AlertComponent,
    NotificationItemComponent,
    NotificationLoadingComponent,
  ],
})
export class NotificationsPage {
  route = inject(ActivatedRoute);
  notificationService = inject(NotificationService);
  authService = inject(AuthService);
  uiService = inject(UiService);
  canGetMore = signal(true);
  isLoading = signal(false);
  pageFrom = '';
  backIcon = ArrowLeft;
  noConnectionIcon = WifiOffIcon;
  emptyIcon = FolderOpenIcon;
  moreIcon = ChevronDown;

  async ionViewWillEnter() {
    this.route.queryParamMap.subscribe((params) => {
      const page = params.get('from');

      if (!page) this.pageFrom = '/tabs/profile';

      this.pageFrom = params.get('from')!;
    });

    this._fetchNotifications({
      reset: true,
    });
  }

  private _fetchNotifications(options?: {
    page?: number;
    amount?: number;
    onSuccess?: (response: List<Notification[]>) => void;
    onComplete?: () => void;
    reset?: boolean;
  }): void {
    const {
      page = 1,
      amount = 5,
      onSuccess,
      onComplete,
      reset = false,
    } = options ?? {};

    const user = this.authService.user();

    if (!user) {
      void this.uiService.showToast('Ocurrió un error al obtener tus datos.');

      return;
    }

    if (reset) {
      this.notificationService.resetSignals();
      this.notificationService.isLoading.set(true);
      this.canGetMore.set(true);
    }

    this.notificationService.getNotifications(user.id, amount, page).subscribe({
      next: (response) => {
        if (onSuccess) {
          onSuccess(response);
          return;
        }

        this.notificationService.notificationList.set(response);
      },

      error: async () => {
        await this.uiService.showToast(
          'Ocurrió un error al obtener las notificaciones.'
        );
      },

      complete: () => {
        this.notificationService.isLoading.set(false);
        this.isLoading.set(false);
        onComplete?.();
      },
    });
  }

  refreshNotifications(event: RefresherCustomEvent): void {
    this._fetchNotifications({
      reset: true,

      onComplete: () => {
        event.target.complete();
      },
    });
  }

  getMoreNotifications(): void {
    this.isLoading.set(true);

    const nextPage =
      this.notificationService.notificationList().pagination.page + 1;

    this._fetchNotifications({
      page: nextPage,

      onSuccess: (response) => {
        this.notificationService.notificationList.update((current) => ({
          data: [...current.data, ...response.data],
          pagination: response.pagination,
        }));

        if (
          !response.data.length ||
          response.pagination.total ===
            this.notificationService.notificationList().data.length
        ) {
          this.canGetMore.set(false);
        }
      },
    });
  }

  ionViewWillLeave() {
    if (!this.notificationService.notificationList().data.length) return;

    const hasUnreadNotification = this.notificationService
      .notificationList()
      .data.some((notification) => notification.isRead === false);

    if (hasUnreadNotification) {
      this.notificationService.hasNewNotification.set(true);

      localStorage.setItem('hasNewNotification', 'true');
    } else {
      this.notificationService.hasNewNotification.set(false);

      localStorage.removeItem('hasNewNotification');
    }
  }
}
