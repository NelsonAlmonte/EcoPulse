import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@core/services/api.service';
import { ApiResult } from '@core/interfaces/api.interface';
import { CreateIssueDto } from '@shared/dto/issue.dto';
import { Issue } from '@shared/models/issue.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class IssueService {
  apiService = inject(ApiService);
  http = inject(HttpClient);
  issues = signal<ApiResult<Issue[]>>({
    data: [],
    error: null,
  });
  URL = `${environment.apiUrl}issue`;

  createIssue(issue: CreateIssueDto): Observable<ApiResult<Issue>> {
    return this.apiService.doPost<Issue, CreateIssueDto>(this.URL, issue);
  }

  getIssues() {
    this.apiService
      .doFetch<Issue[]>(this.URL)
      .subscribe((result) => this.issues.set(result));
  }
}
