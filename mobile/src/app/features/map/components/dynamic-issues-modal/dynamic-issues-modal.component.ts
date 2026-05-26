import { Component, inject, OnInit, signal } from '@angular/core';
import { IssueService } from '@core/services/issue.service';
import { MapService } from '@core/services/map.service';
import { UiService } from '@core/services/ui.service';
import { IssueListComponent } from '@features/report/components/issue-list/issue-list.component';
import {
  InfiniteScrollCustomEvent,
  IonContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonRippleEffect,
  ModalController,
  ToastController,
} from '@ionic/angular/standalone';
import { LucideAngularModule, MapIcon, XIcon } from 'lucide-angular';

@Component({
  selector: 'app-dynamic-issues-modal',
  templateUrl: './dynamic-issues-modal.component.html',
  styleUrls: ['./dynamic-issues-modal.component.css'],
  imports: [
    IonContent,
    IssueListComponent,
    LucideAngularModule,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonRippleEffect,
  ],
})
export class DynamicIssuesModalComponent implements OnInit {
  issueService = inject(IssueService);
  mapService = inject(MapService);
  uiService = inject(UiService);
  modalController = inject(ModalController);
  toastController = inject(ToastController);
  canGetMore = signal(true);
  mapIcon = MapIcon;
  xIcon = XIcon;

  ngOnInit(): void {
    this.canGetMore.set(true);
  }

  async close() {
    const modal = await this.modalController.getTop();
    modal?.dismiss();
  }

  async setBreakpoint(breakpoint: number) {
    const modal = await this.modalController.getTop();
    modal?.setCurrentBreakpoint(breakpoint);
  }

  getMoreIssues(event: InfiniteScrollCustomEvent) {
    const bounds = this.mapService.bounds();

    if (!bounds) return;

    const nextPage = this.issueService.issueList().pagination.page + 1;

    this.issueService.getIssuesByBounds(bounds, nextPage).subscribe({
      next: (response) => {
        this.issueService.issueList.update((current) => {
          return {
            data: [...current.data, ...response.data],
            pagination: response.pagination,
          };
        });

        if (!response.data.length) this.canGetMore.set(false);
      },
      error: async (err) => {
        await this.uiService.showToast(
          'Ocurrió un error al obtener los reportes.',
        );
      },
      complete: () => this.issueService.isLoading.set(false),
    });

    setTimeout(() => {
      event.target.complete();
    }, 1500);
  }
}
