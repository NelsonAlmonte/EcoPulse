import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@core/services/api.service';
import { CreateIssueDto } from '@shared/dto/issue.dto';
import { Issue, SupaBaseUploadFileResponse } from '@shared/models/issue.model';
import { environment } from 'src/environments/environment';
import { ToastController } from '@ionic/angular/standalone';
import { Bounds } from '@shared/models/user.model';
import { List } from '@shared/models/response.model';
import { Status } from '@shared/constants/system.constant';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class IssueService {
  apiService = inject(ApiService);
  authService = inject(AuthService);
  toastController = inject(ToastController);
  issue = signal<Issue | null>(null);
  issueList = signal<List<Issue[]>>({
    data: [],
    pagination: {
      page: 1,
      amount: 5,
      total: 5,
    },
  });
  isLoading = signal(false);
  order = signal('highlights:desc');
  filter = signal<Status>('TODO');
  URL = `${environment.apiUrl}issue`;

  createIssue(issue: CreateIssueDto): Observable<Issue> {
    return this.apiService.doPost<Issue, CreateIssueDto>(this.URL, issue);
  }

  uploadPhoto(formData: FormData): Observable<SupaBaseUploadFileResponse> {
    return this.apiService.doPost<SupaBaseUploadFileResponse, FormData>(
      `${this.URL}/upload`,
      formData
    );
  }

  getIssue(issueId: string, userId: string): Observable<Issue> {
    this.issue.set(null);

    return this.apiService.doFetch<Issue>(`${this.URL}/${issueId}/${userId}`);
  }

  getIssuesByBounds(
    bounds: Bounds,
    page: number = 1
  ): Observable<List<Issue[]>> {
    const params = new URLSearchParams({
      north: String(bounds.north),
      south: String(bounds.south),
      east: String(bounds.east),
      west: String(bounds.west),
      page: String(page),
      amount: '10',
      userId: this.authService.user()!.id,
      order: this.order(),
    });

    if (this.filter() !== 'TODO') {
      params.append('status', this.filter());
    }

    return this.apiService.doFetch<List<Issue[]>>(
      `${this.URL}/in-bound?${params}`
    );
  }

  deleteIssue(id: string): Observable<Issue> {
    return this.apiService.doDelete<Issue>(`${this.URL}/${id}`);
  }
}
