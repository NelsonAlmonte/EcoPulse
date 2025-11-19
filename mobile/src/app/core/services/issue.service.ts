import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@core/services/api.service';
import { CreateIssueDto } from '@shared/dto/issue.dto';
import { Issue, SupaBaseUploadFileResponse } from '@shared/models/issue.model';
import { environment } from 'src/environments/environment';
import { ToastController } from '@ionic/angular/standalone';
import { Bounds } from '@shared/models/user.model';
import { List } from '@shared/models/response.model';

@Injectable({
  providedIn: 'root',
})
export class IssueService {
  apiService = inject(ApiService);
  toastController = inject(ToastController);
  issues = signal<Issue[]>([]);
  issue = signal<Issue | null>(null);
  issueList = signal<List<Issue[]>>({
    data: [],
    pagination: {
      page: 1,
      amount: 5,
      total: 5,
    },
  });
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

  getIssue(issueId: string, userId: string): void {
    this.issue.set(null);

    this.apiService
      .doFetch<Issue>(`${this.URL}/${issueId}/${userId}`)
      .subscribe({
        next: (response) => {
          this.issue.set(response);
        },
        error: async (err) => {
          console.log(err);

          const toast = await this.toastController.create({
            message: 'Ocurrió un error al obtener este reporte.',
            duration: 4000,
            position: 'bottom',
          });

          toast.present();
        },
      });
  }

  getIssuesByBounds(bounds: Bounds, page: number = 1) {
    return this.apiService.doFetch<List<Issue[]>>(
      `${this.URL}/in-bound?north=${bounds.north}&south=${bounds.south}&east=${
        bounds.east
      }&west=${bounds.west}&page=${page}&amount=${10}`
    );
  }
}
