import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@core/services/api.service';
import { ApiResult } from '@core/interfaces/api.interface';
import { CreateIssueDto } from '@shared/dto/issue.dto';
import { Issue, SupaBaseUploadFileResponse } from '@shared/models/issue.model';
import { environment } from 'src/environments/environment';
import { ToastController } from '@ionic/angular/standalone';
import { Bounds } from '@shared/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class IssueService {
  apiService = inject(ApiService);
  toastController = inject(ToastController);
  issues = signal<ApiResult<Issue[]>>({
    status: 'LOADING',
    result: {
      data: [],
      pagination: {
        page: 1,
        amount: 10,
        total: 0,
      },
    },
    error: null,
  });
  issue = signal<ApiResult<Issue>>({
    status: 'LOADING',
    result: {
      data: null,
    },
    error: null,
  });
  URL = `${environment.apiUrl}issue`;

  createIssue(issue: CreateIssueDto): Observable<ApiResult<Issue>> {
    return this.apiService.doPost<Issue, CreateIssueDto>(this.URL, issue);
  }

  getIssues(): void {
    this.issues.set({
      status: 'LOADING',
      result: {
        data: [],
        pagination: {
          page: 1,
          amount: 10,
          total: 0,
        },
      },
      error: null,
    });

    this.apiService
      .doFetch<Issue[]>(this.URL)
      .subscribe((response) => this.issues.set(response));
  }

  getIssueByCoords(latitude: string, longitude: string): void {
    this.issue.set({
      status: 'LOADING',
      result: {
        data: null,
      },
      error: null,
    });

    this.apiService
      .doFetch<Issue>(`${this.URL}/${latitude}/${longitude}`)
      .subscribe((response) => {
        if (response.result) this.issue.set(response);
      });
  }

  uploadPhoto(
    formData: FormData
  ): Observable<ApiResult<SupaBaseUploadFileResponse>> {
    return this.apiService.doPost<SupaBaseUploadFileResponse, FormData>(
      `${this.URL}/upload`,
      formData
    );
  }

  getIssue(issueId: string, userId: string): void {
    this.issue.set({
      status: 'LOADING',
      result: {
        data: null,
      },
      error: null,
    });

    this.apiService
      .doFetch<Issue>(`${this.URL}/${issueId}/${userId}`)
      .subscribe(async (response) => {
        if (response.error) {
          console.log(response.error);
          const toast = await this.toastController.create({
            message: 'Ocurrió un error al obtener este reporte.',
            duration: 4000,
            position: 'bottom',
            animated: true,
          });

          toast.present();

          return;
        }
        console.log(response);
        this.issue.set(response);
      });
  }

  getIssuesByBounds(bounds: Bounds): void {
    this.issues.set({
      status: 'LOADING',
      result: {
        data: [],
        pagination: {
          page: 1,
          amount: 10,
          total: 0,
        },
      },
      error: null,
    });

    this.apiService
      .doFetch<Issue[]>(
        `${this.URL}/in-bound?north=${bounds.north}&south=${
          bounds.south
        }&east=${bounds.east}&west=${bounds.west}&page=${1}&amount=${10}`
      )
      .subscribe((response) => {
        console.log(response);
        this.issues.update(() => response);
      });
  }
}
