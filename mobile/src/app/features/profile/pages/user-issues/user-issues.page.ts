import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  InfiniteScrollCustomEvent,
  IonButtons,
  IonContent,
  IonHeader,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonRefresher,
  IonRefresherContent,
  IonRippleEffect,
  IonTitle,
  IonToolbar,
  RefresherCustomEvent,
  ToastController,
  IonActionSheet,
} from '@ionic/angular/standalone';
import { IssueListComponent } from '@features/report/components/issue-list/issue-list.component';
import { StatusFilterComponent } from '@features/report/components/status-filter/status-filter.component';
import { UserService } from '@core/services/user.service';
import { AuthService } from '@core/services/auth.service';
import { UiService } from '@core/services/ui.service';
import { ArrowLeft, ArrowUpDown, LucideAngularModule } from 'lucide-angular';
import { RouterLink } from '@angular/router';
import type { OverlayEventDetail } from '@ionic/core';
import { Filter } from '@shared/constants/system.constant';
import { List } from '@shared/models/response.model';
import { Issue } from '@shared/models/issue.model';

@Component({
  selector: 'app-user-issues',
  templateUrl: './user-issues.page.html',
  styleUrls: ['./user-issues.page.css'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonRefresher,
    IonRefresherContent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonRippleEffect,
    IonActionSheet,
    CommonModule,
    FormsModule,
    IssueListComponent,
    StatusFilterComponent,
    LucideAngularModule,
    RouterLink,
  ],
})
export class UserIssuesPage {
  userService = inject(UserService);
  authService = inject(AuthService);
  uiService = inject(UiService);
  toastController = inject(ToastController);
  canGetMore = signal(true);
  actionSheetButtons = [
    {
      text: 'Más recientes',
      data: {
        value: 'createdAt:desc',
      },
    },
    {
      text: 'Más antiguos',
      data: {
        value: 'createdAt:asc',
      },
    },
    {
      text: 'Más destacados',
      data: {
        value: 'highlights:desc',
      },
    },
    {
      text: 'Menos destacados',
      data: {
        value: 'highlights:asc',
      },
    },
  ];
  orderBy = 'createdAt:desc';
  filter: Filter = 'TODO';
  backIcon = ArrowLeft;
  orderIcon = ArrowUpDown;

  private _fetchIssues(options?: {
    page?: number;
    amount?: number;
    orderBy?: string;
    filter?: Filter;
    onSuccess?: (response: List<Issue[]>) => void;
    onComplete?: () => void;
    reset?: boolean;
  }): void {
    if (!this.uiService.hasConnection()) return;

    const {
      page = 1,
      amount = 5,
      orderBy = this.orderBy,
      filter = this.filter,
      onSuccess,
      onComplete,
      reset = false,
    } = options ?? {};

    if (reset) {
      this.userService.isLoading.set(true);
      this.canGetMore.set(true);
    }

    this.userService
      .getUserIssues(
        this.authService.loggedUserData()!.id,
        amount,
        page,
        orderBy,
        filter
      )
      .subscribe({
        next: (response) => {
          if (onSuccess) {
            onSuccess(response);
            return;
          }

          this.userService.issueList.set(response);
        },

        error: async () => {
          await this.uiService.showToast(
            'Ocurrió un error al obtener los reportes.'
          );
        },

        complete: () => {
          this.userService.isLoading.set(false);
          onComplete?.();
        },
      });
  }

  ionViewWillEnter(): void {
    this._fetchIssues({
      reset: true,
    });
  }

  refreshUserIssues(event: RefresherCustomEvent): void {
    this._fetchIssues({
      reset: true,
      onComplete: () => event.target.complete(),
    });
  }

  getMoreIssues(event: InfiniteScrollCustomEvent): void {
    const nextPage = this.userService.issueList().pagination.page + 1;

    this._fetchIssues({
      page: nextPage,

      onSuccess: (response) => {
        this.userService.issueList.update((current) => ({
          data: [...current.data, ...response.data],
          pagination: response.pagination,
        }));

        if (!response.data.length) {
          this.canGetMore.set(false);
        }
      },

      onComplete: () => {
        event.target.complete();
      },
    });
  }

  orderIssues(event: CustomEvent<OverlayEventDetail>): void {
    if (!event.detail.data) return;

    this.orderBy = event.detail.data.value;

    this._fetchIssues({
      reset: true,
    });
  }

  onFilterSelected(filter: Filter): void {
    this.filter = filter;

    this._fetchIssues({
      reset: true,
    });
  }

  ionViewWillLeave(): void {
    this.filter = 'TODO';

    this._fetchIssues({
      reset: true,
      amount: this.userService.AMOUNT_OF_ISSUES_IN_REPORT_PAGE,
    });
  }
}
