import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@core/services/api.service';
import { ApiResult } from '@core/interfaces/api.interface';
import { Category } from '@shared/models/category.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  apiService = inject(ApiService);
  ENDPOINT = 'category';

  getCategories(): Observable<ApiResult<Category[]>> {
    return this.apiService.doFetch<Category[]>(
      `${environment.apiUrl}${this.ENDPOINT}`
    );
  }
}
