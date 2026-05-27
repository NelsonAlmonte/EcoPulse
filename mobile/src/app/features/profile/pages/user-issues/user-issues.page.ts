import { Component, inject, OnInit, signal } from '@angular/core';
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
import { UserService } from '@core/services/user.service';
import { AuthService } from '@core/services/auth.service';
import { UiService } from '@core/services/ui.service';
import {
  ArrowLeft,
  EllipsisVertical,
  LucideAngularModule,
} from 'lucide-angular';
import { RouterLink } from '@angular/router';
import type { OverlayEventDetail } from '@ionic/core';

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
    LucideAngularModule,
    RouterLink,
  ],
})
export class UserIssuesPage implements OnInit {
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
  sortBy = 'createdAt:desc';
  backIcon = ArrowLeft;
  optionsIcon = EllipsisVertical;

  ngOnInit(): void {
    this.userService.isLoading.set(true);

    this.userService
      .getUserIssues(this.authService.loggedUserData()!.id)
      .subscribe({
        next: (response) => this.userService.issueList.set(response),
        error: async (err) => {
          await this.uiService.showToast(
            'Ocurrió un error al obtener los reportes.',
          );
        },
        complete: () => this.userService.isLoading.set(false),
      });
  }

  refreshUserIssues(event: RefresherCustomEvent): void {
    this.canGetMore.set(true);
    this.userService.isLoading.set(true);

    this.userService
      .getUserIssues(this.authService.loggedUserData()!.id, 5, 1, this.sortBy)
      .subscribe({
        next: (response) => this.userService.issueList.set(response),
        error: async (err) => {
          await this.uiService.showToast(
            'Ocurrió un error al obtener los reportes.',
          );
        },
        complete: () => {
          event.target.complete();
          this.userService.isLoading.set(false);
        },
      });
  }

  getMoreIssues(event: InfiniteScrollCustomEvent) {
    const nextPage = this.userService.issueList().pagination.page + 1;

    this.userService
      .getUserIssues(
        this.authService.loggedUserData()!.id,
        5,
        nextPage,
        this.sortBy,
      )
      .subscribe({
        next: (response) => {
          this.userService.issueList.update((current) => {
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
        complete: () => this.userService.isLoading.set(false),
      });

    setTimeout(() => {
      event.target.complete();
    }, 1500);
  }

  sortIssues(event: CustomEvent<OverlayEventDetail>) {
    this.sortBy = event.detail.data.value;

    this.userService.isLoading.set(true);

    this.userService
      .getUserIssues(this.authService.loggedUserData()!.id, 5, 1, this.sortBy)
      .subscribe({
        next: (response) => this.userService.issueList.set(response),
        error: async (err) => {
          await this.uiService.showToast(
            'Ocurrió un error al obtener los reportes.',
          );
        },
        complete: () => this.userService.isLoading.set(false),
      });
  }

  ionViewWillLeave(): void {
    this.userService.isLoading.set(true);

    this.userService
      .getUserIssues(
        this.authService.loggedUserData()!.id,
        this.userService.AMOUNT_OF_ISSUES_IN_REPORT_PAGE,
      )
      .subscribe({
        next: (response) => {
          this.userService.issueList.set(response);
        },
        error: async (err) => {
          await this.uiService.showToast(
            'Ocurrió un error al obtener los reportes.',
          );
        },
        complete: () => this.userService.isLoading.set(false),
      });
  }
}
