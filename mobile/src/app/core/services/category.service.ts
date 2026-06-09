import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from '@core/services/api.service';
import { Category } from '@shared/models/category.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  apiService = inject(ApiService);
  categories = signal<Category[]>([]);
  URL = `${environment.apiUrl}category`;

  getCategories(): Observable<Category[]> {
    return this.apiService.doFetch<Category[]>(this.URL);
  }
}
