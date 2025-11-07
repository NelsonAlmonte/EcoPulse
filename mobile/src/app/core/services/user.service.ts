import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from '@core/services/api.service';
import { ApiResult } from '@core/interfaces/api.interface';
import { Issue } from '@shared/models/issue.model';
import { environment } from 'src/environments/environment';
import { User, Counters } from '@shared/models/user.model';
import { UpdateUserDto } from '@shared/dto/user.dto';
import { Observable } from 'rxjs';
import { isPaginated } from '@shared/helpers/api.helper';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiService = inject(ApiService);
  issues = signal<ApiResult<Issue[]>>({
    status: 'LOADING',
    result: {
      data: [],
    },
    error: null,
  });
  user = signal<ApiResult<User>>({
    status: 'LOADING',
    result: {
      data: null,
    },
    error: null,
  });
  counters = signal<Counters>({
    issues: 0,
    highlightsGiven: 0,
    highlightsReceived: 0,
  });
  URL = `${environment.apiUrl}user`;

  getUserIssues(id: string, amount?: number): void {
    this.issues.set({
      status: 'LOADING',
      result: {
        data: null,
      },
      error: null,
    });

    this.apiService
      .doFetch<Issue[]>(`${this.URL}/${id}/issues?amount=${amount}`)
      .subscribe((response) => {
        const result = response.result;

        if (isPaginated(result) && result.data) {
          const updatedData = result.data.map((issue) => ({
            ...issue,
            photo: `${environment.publicBucketUrl}/${issue.photo}`,
          }));

          this.issues.set({ ...response, result: { data: updatedData } });
        }
      });
  }

  getUser(id: string): void {
    this.user.set({
      status: 'LOADING',
      result: {
        data: null,
      },
      error: null,
    });

    this.apiService.doFetch<User>(`${this.URL}/${id}`).subscribe((response) => {
      const result = response.result;

      if (!isPaginated(result) && result) {
        this.user.set(response);
      }

      if (response.error) {
        console.log(response.error);
      }
    });
  }

  updateUser(
    id: string,
    updateUserDto: UpdateUserDto
  ): Observable<ApiResult<User>> {
    return this.apiService.doPut<User, UpdateUserDto>(
      `${this.URL}/${id}`,
      updateUserDto
    );
  }

  countUserIssues(id: string): void {
    this.counters.set({ issues: 0 });

    this.apiService
      .doFetch<string>(`${this.URL}/${id}/issues/count`)
      .subscribe((response) => {
        if (response.error) {
          console.log(response.error);
          return;
        }

        const result = response.result;

        if (!isPaginated(result) && result) {
          this.counters.set({
            ...this.counters(),
            issues: Number(response.result),
          });
        }
      });
  }

  counthighlightsGiven(id: string): void {
    this.counters.set({ highlightsGiven: 0 });

    this.apiService
      .doFetch<string>(`${this.URL}/${id}/highlights/given/count`)
      .subscribe((response) => {
        if (response.error) {
          console.log(response.error);
          return;
        }

        const result = response.result;

        if (!isPaginated(result) && result) {
          this.counters.set({
            ...this.counters(),
            highlightsGiven: Number(response.result),
          });
        }
      });
  }

  counthighlightsReceived(id: string): void {
    this.counters.set({ highlightsReceived: 0 });

    this.apiService
      .doFetch<string>(`${this.URL}/${id}/highlights/received/count`)
      .subscribe((response) => {
        if (response.error) {
          console.log(response.error);
          return;
        }

        const result = response.result;

        if (!isPaginated(result) && result) {
          this.counters.set({
            ...this.counters(),
            highlightsReceived: Number(response.result),
          });
        }
      });
  }

  getHighlightsGiven(id: string): void {
    this.issues.set({
      status: 'LOADING',
      result: {
        data: null,
      },
      error: null,
    });

    this.apiService
      .doFetch<Issue[]>(`${this.URL}/${id}/highlights/given`)
      .subscribe((response) => {
        const result = response.result;

        if (!isPaginated(result) && response.result) {
          const updatedData = result.map((issue) => ({
            ...issue,
            photo: `${environment.publicBucketUrl}/${issue.photo}`,
          }));

          this.issues.set({ ...response, result: { data: updatedData } });
        }
      });
  }
}
