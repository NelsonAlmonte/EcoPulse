import { inject, Injectable } from '@angular/core';
import { RealtimeChannel } from '@supabase/supabase-js';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  authService = inject(AuthService);
  private channel?: RealtimeChannel;

  async startListening() {
    if (this.channel) this.stopListening();

    this.channel = this.authService.supabase
      .channel(`schema-db-changes`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'Notification',
          // filter: `recipient_id=eq.${userId}`,
        },
        (payload) => {
          console.log(payload);
        }
      )
      .subscribe((status, err) => {
        console.log('STATUS', status);
        console.log('ERROR', err);
      });
  }

  stopListening(): void {
    this.channel?.unsubscribe();
  }
}
