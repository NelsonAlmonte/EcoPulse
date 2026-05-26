import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from '@core/services/api.service';
import { Issue } from '@shared/models/issue.model';
import { environment } from 'src/environments/environment';
import { User, Counters } from '@shared/models/user.model';
import { UpdateUserDto } from '@shared/dto/user.dto';
import { Observable } from 'rxjs';
import { List } from '@shared/models/response.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiService = inject(ApiService);
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
  ): Observable<List<Issue[]>> {
    return this.apiService.doFetch<List<Issue[]>>(
      `${this.URL}/${id}/issues?amount=${amount}&page=${page}&order=createdAt:desc`,
    );
  }

  getUser(id: string): Observable<User> {
    return this.apiService.doFetch<User>(`${this.URL}/${id}`);
  }

  updateUser(id: string, updateUserDto: UpdateUserDto): Observable<User> {
    return this.apiService.doPut<User, UpdateUserDto>(
      `${this.URL}/${id}`,
      updateUserDto,
    );
  }

  countUserIssues(id: string): Observable<string> {
    return this.apiService.doFetch<string>(`${this.URL}/${id}/issues/count`);
  }

  counthighlightsGiven(id: string): Observable<string> {
    return this.apiService.doFetch<string>(
      `${this.URL}/${id}/highlights/given/count`,
    );
  }

  counthighlightsReceived(id: string): Observable<string> {
    return this.apiService.doFetch<string>(
      `${this.URL}/${id}/highlights/received/count`,
    );
  }

  getHighlightsGiven(id: string, amount: number = 5, page: number = 1) {
    return this.apiService.doFetch<List<Issue[]>>(
      `${this.URL}/${id}/highlights/given?amount=${amount}&page=${page}&order=createdAt:desc`,
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
}
