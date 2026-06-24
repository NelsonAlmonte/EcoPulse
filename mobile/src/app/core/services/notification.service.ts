import { inject, Injectable, signal } from '@angular/core';
import { RealtimeChannel } from '@supabase/supabase-js';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Notification } from '@shared/models/notification.model';
import { ApiService } from './api.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  authService = inject(AuthService);
  apiService = inject(ApiService);
  notifications = signal<Notification[]>([]);
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

  getNotifications(userId: string): Observable<Notification[]> {
    return this.apiService.doFetch<Notification[]>(`${this.URL}/${userId}`);
  }
}
