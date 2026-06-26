import { inject, Injectable, signal } from '@angular/core';
import { RealtimeChannel } from '@supabase/supabase-js';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Notification } from '@shared/models/notification.model';
import { ApiService } from './api.service';
import { environment } from 'src/environments/environment';
import { List } from '@shared/models/response.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  authService = inject(AuthService);
  apiService = inject(ApiService);
  notificationList = signal<List<Notification[]>>({
    data: [],
    pagination: {
      page: 1,
      amount: 5,
      total: 5,
    },
  });
  hasNewNotification = signal(false);
  isLoading = signal(false);
  private channel?: RealtimeChannel;
  URL = `${environment.apiUrl}notification`;

  startListening(userId: string) {
    if (this.channel) this.stopListening();

    this.channel = this.authService.supabase
      .channel(`schema-db-changes`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'Notification',
          filter: `recipientId=eq.${userId}`,
        },
        (payload) => {
          if (payload.new['id']) {
            this.hasNewNotification.set(true);

            localStorage.setItem('hasNewNotification', 'true');
          }

          console.log(payload);
        }
      )
      .subscribe();
  }

  stopListening(): void {
    this.channel?.unsubscribe();
  }

  getNotifications(
    userId: string,
    amount: number = 5,
    page: number = 1
  ): Observable<List<Notification[]>> {
    const params = new URLSearchParams({
      amount: String(amount),
      page: String(page),
    });

    return this.apiService.doFetch<List<Notification[]>>(
      `${this.URL}/${userId}?${params}`
    );
  }

  resetSignals(): void {
    this.notificationList.set({
      data: [],
      pagination: {
        page: 1,
        amount: 5,
        total: 5,
      },
    });
  }
}
