import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiService } from './api.service';
import { GetHighlightDto, HighlightDto } from '@shared/dto/highlight.dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HighlightService {
  apiService = inject(ApiService);
  URL = `${environment.apiUrl}highlight`;

  createHighlight(highlightDto: HighlightDto): Observable<GetHighlightDto> {
    return this.apiService.doPost<GetHighlightDto, HighlightDto>(
      this.URL,
      highlightDto
    );
  }

  deleteHighlight(highlightDto: HighlightDto): Observable<GetHighlightDto> {
    const endpointUrl = `${this.URL}/${highlightDto.issueId}/${highlightDto.userId}`;

    return this.apiService.doDelete<GetHighlightDto>(endpointUrl);
  }
}
