import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
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

  createIssue(issue: CreateIssueDto): Observable<ApiResult<Issue>> {
    return this.apiService.doPost<Issue, CreateIssueDto>(
      `${environment.apiUrl}issue`,
      issue
    );
  }
}
