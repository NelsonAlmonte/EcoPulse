import { inject, Injectable } from '@angular/core';
import { RealtimeChannel } from '@supabase/supabase-js';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  authService = inject(AuthService);
  private channel?: RealtimeChannel;

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
          console.log(payload);
        }
      )
      .subscribe();
  }

  stopListening(): void {
    this.channel?.unsubscribe();
  }
}
