import {
  Component,
  ElementRef,
  inject,
  input,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { HighlightService } from '@core/services/highlight.service';
import { HighlightDto } from '@shared/dto/highlight.dto';
import { Issue } from '@shared/models/issue.model';
import { LucideAngularModule, StarIcon } from 'lucide-angular';

@Component({
  selector: 'app-highlight-button',
  templateUrl: './highlight-button.component.html',
  styleUrls: ['./highlight-button.component.css'],
  imports: [LucideAngularModule],
})
export class HighlightButtonComponent {
  issue = input.required<Issue>();
  renderer = inject(Renderer2);
  highlightService = inject(HighlightService);
  authService = inject(AuthService);
  @ViewChild('highlightsCount') highlightsCount!: ElementRef<HTMLSpanElement>;
  highlightIcon = StarIcon;

  manageHighlight(event: MouseEvent): void {
    const element = event.currentTarget as HTMLDivElement;
    const isHighlighted = element.classList.contains('highlighted');
    const delta = isHighlighted ? -1 : 1;
    const highlightDto: HighlightDto = {
      issueId: this.issue().id,
      userId: this.authService.loggedUserData().id,
    };

    isHighlighted
      ? this.removeHighlight(element, highlightDto)
      : this.addHighlight(element, highlightDto);

    this.updateHighlightCounter(delta);
  }

  private addHighlight(element: HTMLElement, dto: HighlightDto): void {
    this.renderer.addClass(element, 'highlighted');
    this.renderer.setProperty(element, 'disabled', true);

    this.highlightService.createHighlight(dto).subscribe((result) => {
      if (result.error) {
        this.renderer.removeClass(element, 'highlighted');
        this.updateHighlightCounter(-1);
        this.handleError(result.error);
      }

      this.renderer.setProperty(element, 'disabled', false);
    });
  }

  private removeHighlight(element: HTMLElement, dto: HighlightDto): void {
    this.renderer.removeClass(element, 'highlighted');
    this.renderer.setProperty(element, 'disabled', true);

    this.highlightService.deleteHighlight(dto).subscribe((result) => {
      if (result.error) {
        this.renderer.addClass(element, 'highlighted');
        this.updateHighlightCounter(1);
        this.handleError(result.error);
      }

      this.renderer.setProperty(element, 'disabled', false);
    });
  }

  private handleError(error: any): void {
    // TODO: Proper error handling
    console.error('Highlight error:', error);
  }

  private updateHighlightCounter(value: number): void {
    const el = this.highlightsCount.nativeElement;
    const current = Number(el.innerText) || 0;
    const updated = current + value;

    this.renderer.setProperty(el, 'innerText', updated.toString());
  }
}
