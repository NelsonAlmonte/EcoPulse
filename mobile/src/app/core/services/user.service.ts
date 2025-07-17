import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from '@core/services/api.service';
import { ApiResult } from '@core/interfaces/api.interface';
import { Issue } from '@shared/models/issue.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiService = inject(ApiService);
  issues = signal<ApiResult<Issue[]>>({
    status: 'LOADING',
    data: [],
    error: null,
  });
  URL = `${environment.apiUrl}user`;

  getUserIssues(userId: string): void {
    this.issues.set({ status: 'LOADING', data: null, error: null });

    this.apiService
      .doFetch<Issue[]>(`${this.URL}/${userId}/issues`)
      .subscribe((result) => {
        if (result.data) {
          const updatedData = result.data.map((issue) => ({
            ...issue,
            photo: `${environment.publicBucketUrl}/${issue.photo}`,
          }));

          this.issues.set({ ...result, data: updatedData });
        }
      });
  }
}
