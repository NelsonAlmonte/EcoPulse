import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from '@core/services/api.service';
import { ApiResult } from '@core/interfaces/api.interface';
import { Category } from '@shared/models/category.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  apiService = inject(ApiService);
  categories = signal<ApiResult<Category[]>>({
    status: 'LOADING',
    data: [],
    error: null,
  });
  URL = `${environment.apiUrl}category`;

  getCategories(): void {
    this.categories.set({ status: 'LOADING', data: [], error: null });

    this.apiService
      .doFetch<Category[]>(this.URL)
      .subscribe((result) => this.categories.set(result));
  }
}
