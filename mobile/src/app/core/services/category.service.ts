import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from '@core/services/api.service';
import { Category } from '@shared/models/category.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  apiService = inject(ApiService);
  categories = signal<Category[]>([]);
  URL = `${environment.apiUrl}category`;

  getCategories(): void {
    this.categories.set([]);

    this.apiService
      .doFetch<Category[]>(this.URL)
      .subscribe((result) => this.categories.set(result));
  }
}
