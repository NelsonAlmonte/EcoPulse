import { inject, Injectable, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { from, of, switchMap, throwError } from 'rxjs';
import {
  createClient,
  Session,
  SupabaseClient,
  User,
} from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);
  supabase!: SupabaseClient;
  accessToken = signal<string | null>(null);
  session = signal<Session | null>(null);
  user = signal<User | null>(null);

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabasePublishableKey
    );

    this.supabase.auth.onAuthStateChange((event, session) => {
      this.session.set(session);
      this.accessToken.set(session?.access_token ?? null);
      this.user.set(session?.user ?? null);
    });
  }

  login(email: string, password: string) {
    return from(
      this.supabase.auth.signInWithPassword({
        email,
        password,
      })
    ).pipe(
      switchMap(({ data, error }) => {
        if (error) {
          return throwError(() => error);
        }

        return of(data);
      })
    );
  }

  signup(email: string, password: string) {
    return from(
      this.supabase.auth.signUp({
        email,
        password,
      })
    ).pipe(
      switchMap(({ data, error }) => {
        if (error) {
          return throwError(() => error);
        }

        return of(data);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('issues');

    this.supabase.auth.signOut();

    this.router.navigate(['/login']);
  }
}
