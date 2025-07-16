import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@core/services/api.service';
import { ApiResult } from '@core/interfaces/api.interface';
import { CreateIssueDto } from '@shared/dto/issue.dto';
import { Issue, SupaBaseUploadFileResponse } from '@shared/models/issue.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class IssueService {
  apiService = inject(ApiService);
  issues = signal<ApiResult<Issue[]>>({
    status: 'LOADING',
    data: [],
    error: null,
  });
  issue = signal<ApiResult<Issue>>({
    status: 'LOADING',
    data: null,
    error: null,
  });
  URL = `${environment.apiUrl}issue`;

  createIssue(issue: CreateIssueDto): Observable<ApiResult<Issue>> {
    return this.apiService.doPost<Issue, CreateIssueDto>(this.URL, issue);
  }

  getIssues(): void {
    this.issues.set({ status: 'LOADING', data: [], error: null });

    this.apiService
      .doFetch<Issue[]>(this.URL)
      .subscribe((result) => this.issues.set(result));
  }

  getIssueByCoords(latitude: string, longitude: string): void {
    this.issue.set({ status: 'LOADING', data: null, error: null });

    this.apiService
      .doFetch<Issue>(`${this.URL}/${latitude}/${longitude}`)
      .subscribe((result) => {
        result.data!.photo = `${environment.publicBucketUrl}/${
          result.data!.photo
        }`;
        console.log(result);
        this.issue.set(result);
      });
  }

  uploadPhoto(formData: FormData) {
    return this.apiService.doPost<SupaBaseUploadFileResponse, FormData>(
      `${this.URL}/upload`,
      formData
    );
  }
}
