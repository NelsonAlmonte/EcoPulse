import { inject, Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  authService = inject(AuthService);
  supabase?: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabasePublishableKey,
      {
        // accessToken: this.authService.loggedUserData()!.access_token,
        accessToken: async () => this.authService.session()!.access_token,
      }
    );
  }
  foo() {
    // const foo = this.supabase!.auth.getUser(
    //   this.authService.loggedUserData()!.access_token
    // );

    // console.log(foo);
    const changes = this.supabase!.channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT', // Listen only to INSERTs
          schema: 'public',
          table: 'notifications',
          filter: `recipient_id=eq.566dd7ce-dbc8-416b-bf29-8dce970b8094`,
        },
        (payload) => console.log(payload)
      )
      .subscribe();
  }
}
