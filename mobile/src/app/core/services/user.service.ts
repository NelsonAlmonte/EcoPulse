import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from '@core/services/api.service';
import { ApiResult } from '@core/interfaces/api.interface';
import { Issue } from '@shared/models/issue.model';
import { environment } from 'src/environments/environment';
import { User } from '@shared/models/user.model';
import { UpdateUserDto } from '@shared/dto/user.dto';
import { Observable } from 'rxjs';

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
  user = signal<ApiResult<User>>({
    status: 'LOADING',
    data: null,
    error: null,
  });
  URL = `${environment.apiUrl}user`;

  getUserIssues(id: string): void {
    this.issues.set({ status: 'LOADING', data: null, error: null });

    this.apiService
      .doFetch<Issue[]>(`${this.URL}/${id}/issues`)
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

  getUser(id: string): void {
    this.user.set({ status: 'LOADING', data: null, error: null });

    this.apiService.doFetch<User>(`${this.URL}/${id}`).subscribe((result) => {
      if (result.data) {
        this.user.set(result);
      }

      if (result.error) {
        console.log(result.error);
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
}
