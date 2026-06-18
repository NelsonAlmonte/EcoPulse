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
import { UiService } from '@core/services/ui.service';
import { ToastController } from '@ionic/angular/standalone';
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
  uiService = inject(UiService);
  toastController = inject(ToastController);
  @ViewChild('highlightsCount') highlightsCount!: ElementRef<HTMLSpanElement>;
  highlightIcon = StarIcon;

  manageHighlight(event: MouseEvent): void {
    const button = event.currentTarget as HTMLButtonElement;

    this.animateButton(button);

    const isHighlighted = button.classList.contains('highlighted');
    const delta = isHighlighted ? -1 : 1;
    const highlightDto: HighlightDto = {
      issueId: this.issue().id,
      userId: this.authService.user()!.id,
    };

    isHighlighted
      ? this.removeHighlight(button, highlightDto)
      : this.addHighlight(button, highlightDto);

    this.updateHighlightCounter(delta);
  }

  private addHighlight(button: HTMLElement, dto: HighlightDto): void {
    this.renderer.setProperty(button, 'disabled', true);

    this.issue().hasCurrentUserHighlight = true;

    this.highlightService.createHighlight(dto).subscribe({
      next: () => {
        this.renderer.setProperty(button, 'disabled', false);
      },
      error: async (err) => {
        await this.handleError(err);

        this.issue().hasCurrentUserHighlight = false;
        this.renderer.setProperty(button, 'disabled', false);
        this.updateHighlightCounter(-1);
      },
    });
  }

  private removeHighlight(button: HTMLElement, dto: HighlightDto): void {
    this.renderer.setProperty(button, 'disabled', true);

    this.issue().hasCurrentUserHighlight = false;

    this.highlightService.deleteHighlight(dto).subscribe({
      next: () => {
        this.renderer.setProperty(button, 'disabled', false);
      },
      error: async (err) => {
        await this.handleError(err);

        this.issue().hasCurrentUserHighlight = true;
        this.renderer.setProperty(button, 'disabled', false);
        this.updateHighlightCounter(1);
      },
    });
  }

  private async handleError(error: any): Promise<void> {
    await this.uiService.showToast(
      'Ocurrió un error al resaltar este reporte.'
    );
  }

  private updateHighlightCounter(delta: number): void {
    const el = this.highlightsCount.nativeElement;
    const current = Number(el.innerText) || 0;
    const updated = current + delta;

    this.renderer.setProperty(el, 'innerText', updated.toString());
  }

  animateButton(button: HTMLButtonElement): void {
    button.classList.remove('animate-pop');
    void button.offsetWidth;
    button.classList.add('animate-pop');
  }
}
