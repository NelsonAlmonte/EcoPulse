import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from '@core/services/api.service';
import { Issue } from '@shared/models/issue.model';
import { environment } from 'src/environments/environment';
import { User, Counters } from '@shared/models/user.model';
import { CreateUserDto, UpdateUserDto } from '@shared/dto/user.dto';
import { forkJoin, Observable, tap } from 'rxjs';
import { List } from '@shared/models/response.model';
import { Filter } from '@shared/constants/system.constant';
import { AuthService } from './auth.service';
import { UiService } from './ui.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiService = inject(ApiService);
  authService = inject(AuthService);
  uiService = inject(UiService);
  issueList = signal<List<Issue[]>>({
    data: [],
    pagination: {
      page: 1,
      amount: 5,
      total: 5,
    },
  });
  user = signal<User | null>(null);
  counters = signal<Counters>({
    issues: 0,
    highlightsGiven: 0,
    highlightsReceived: 0,
  });
  isLoading = signal(false);
  URL = `${environment.apiUrl}user`;
  AMOUNT_OF_ISSUES_IN_REPORT_PAGE = 3;

  getUserIssues(
    id: string,
    amount: number = 5,
    page: number = 1,
    order: string = 'createdAt:desc',
    filter: Filter = 'TODO'
  ): Observable<List<Issue[]>> {
    const params = new URLSearchParams({
      amount: String(amount),
      page: String(page),
      order,
    });

    if (filter !== 'TODO') {
      params.append('status', filter);
    }

    return this.apiService.doFetch<List<Issue[]>>(
      `${this.URL}/${id}/issues?${params}`
    );
  }

  getUser(id: string): Observable<User> {
    return this.apiService.doFetch<User>(`${this.URL}/${id}`);
  }

  updateUser(id: string, updateUserDto: UpdateUserDto): Observable<User> {
    return this.apiService.doPut<User, UpdateUserDto>(
      `${this.URL}/${id}`,
      updateUserDto
    );
  }

  createUser(createUserDto: CreateUserDto): Observable<User> {
    return this.apiService.doPost<User>(`${this.URL}`, createUserDto);
  }

  countUserIssues(id: string): Observable<string> {
    return this.apiService.doFetch<string>(`${this.URL}/${id}/issues/count`);
  }

  countHighlightsGiven(id: string): Observable<string> {
    return this.apiService.doFetch<string>(
      `${this.URL}/${id}/highlights/given/count`
    );
  }

  countHighlightsReceived(id: string): Observable<string> {
    return this.apiService.doFetch<string>(
      `${this.URL}/${id}/highlights/received/count`
    );
  }

  getHighlightsGiven(
    id: string,
    amount: number = 5,
    page: number = 1,
    order: string = 'createdAt:desc',
    filter: Filter = 'TODO'
  ): Observable<List<Issue[]>> {
    const params = new URLSearchParams({
      amount: String(amount),
      page: String(page),
      order,
    });

    if (filter !== 'TODO') {
      params.append('status', filter);
    }

    return this.apiService.doFetch<List<Issue[]>>(
      `${this.URL}/${id}/highlights/given?${params}`
    );
  }

  resetSignals(): void {
    this.user.set(null);
    this.issueList.set({
      data: [],
      pagination: {
        page: 1,
        amount: 5,
        total: 5,
      },
    });
    this.counters.set({
      issues: 0,
      highlightsGiven: 0,
      highlightsReceived: 0,
    });
    this.isLoading.set(false);
  }

  loadProfile(userId: string): Observable<{
    user: User;
    highlightsGiven: string;
    highlightsReceived: string;
  }> {
    return forkJoin({
      user: this.getUser(userId),
      highlightsGiven: this.countHighlightsGiven(userId),
      highlightsReceived: this.countHighlightsReceived(userId),
    }).pipe(
      tap((response) => {
        this.user.set(response.user);

        this.counters.set({
          issues: Number(response.user.issues),
          highlightsGiven: Number(response.highlightsGiven),
          highlightsReceived: Number(response.highlightsReceived),
        });

        localStorage.setItem('user', JSON.stringify(response.user));
      })
    );
  }
}
