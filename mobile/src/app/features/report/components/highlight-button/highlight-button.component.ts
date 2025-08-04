import { CommonModule } from '@angular/common';
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
  imports: [LucideAngularModule, CommonModule],
})
export class HighlightButtonComponent {
  issue = input.required<Issue>();
  renderer = inject(Renderer2);
  highlightService = inject(HighlightService);
  authService = inject(AuthService);
  @ViewChild('highlightsCount') highlightsCount!: ElementRef<HTMLSpanElement>;
  highlightIcon = StarIcon;

  manageHighlight(event: MouseEvent): void {
    const button = event.currentTarget as HTMLButtonElement;
    const isHighlighted = button.classList.contains('highlighted');
    const delta = isHighlighted ? -1 : 1;
    const highlightDto: HighlightDto = {
      issueId: this.issue().id,
      userId: this.authService.loggedUserData().id,
    };

    isHighlighted
      ? this.removeHighlight(button, highlightDto)
      : this.addHighlight(button, highlightDto);

    // this.updateHighlightCounter(delta);
  }

  private addHighlight(button: HTMLElement, dto: HighlightDto): void {
    this.renderer.setProperty(button, 'disabled', true);

    this.highlightService.createHighlight(dto).subscribe((result) => {
      if (result.error) {
        this.handleError(result.error);
      } else {
        this.issue().hasCurrentUserHighlight = true;
      }

      this.renderer.setProperty(button, 'disabled', false);
    });
  }

  private removeHighlight(button: HTMLElement, dto: HighlightDto): void {
    this.renderer.setProperty(button, 'disabled', true);

    this.highlightService.deleteHighlight(dto).subscribe((result) => {
      if (result.error) {
        this.handleError(result.error);
      } else {
        this.issue().hasCurrentUserHighlight = false;
      }

      this.renderer.setProperty(button, 'disabled', false);
    });
  }

  private handleError(error: any): void {
    // TODO: Proper error handling
    console.error('Highlight error:', error);
  }
}
