import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from '@core/services/api.service';
import { Issue } from '@shared/models/issue.model';
import { environment } from 'src/environments/environment';
import { User, Counters } from '@shared/models/user.model';
import { UpdateUserDto } from '@shared/dto/user.dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiService = inject(ApiService);
  issues = signal<Issue[]>([]);
  user = signal<User | null>(null);
  counters = signal<Counters>({
    issues: 0,
    highlightsGiven: 0,
    highlightsReceived: 0,
  });
  URL = `${environment.apiUrl}user`;

  getUserIssues(id: string, amount?: number): void {
    this.issues.set([]);

    this.apiService
      .doFetch<Issue[]>(`${this.URL}/${id}/issues?amount=${amount}`)
      .subscribe((response) => {
        const updatedData = response.map((issue) => ({
          ...issue,
          photo: `${environment.publicBucketUrl}/${issue.photo}`,
        }));

        this.issues.set(updatedData);
      });
  }

  getUser(id: string): void {
    this.user.set(null);

    this.apiService.doFetch<User>(`${this.URL}/${id}`).subscribe((response) => {
      this.user.set(response);
    });
  }

  updateUser(id: string, updateUserDto: UpdateUserDto): Observable<User> {
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
        this.counters.set({
          ...this.counters(),
          issues: Number(response),
        });
      });
  }

  counthighlightsGiven(id: string): void {
    this.counters.set({ highlightsGiven: 0 });

    this.apiService
      .doFetch<string>(`${this.URL}/${id}/highlights/given/count`)
      .subscribe((response) => {
        this.counters.set({
          ...this.counters(),
          highlightsGiven: Number(response),
        });
      });
  }

  counthighlightsReceived(id: string): void {
    this.counters.set({ highlightsReceived: 0 });

    this.apiService
      .doFetch<string>(`${this.URL}/${id}/highlights/received/count`)
      .subscribe((response) => {
        this.counters.set({
          ...this.counters(),
          highlightsReceived: Number(response),
        });
      });
  }

  getHighlightsGiven(id: string): void {
    this.issues.set([]);

    this.apiService
      .doFetch<Issue[]>(`${this.URL}/${id}/highlights/given`)
      .subscribe((response) => {
        const updatedData = response.map((issue) => ({
          ...issue,
          photo: `${environment.publicBucketUrl}/${issue.photo}`,
        }));

        this.issues.set(updatedData);
      });
  }
}
