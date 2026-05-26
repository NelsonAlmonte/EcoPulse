import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  InfiniteScrollCustomEvent,
  IonButtons,
  IonContent,
  IonHeader,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
  RefresherCustomEvent,
  ToastController,
  IonRippleEffect,
} from '@ionic/angular/standalone';
import { IssueListComponent } from '@features/report/components/issue-list/issue-list.component';
import { UserService } from '@core/services/user.service';
import { AuthService } from '@core/services/auth.service';
import { ArrowLeft, LucideAngularModule } from 'lucide-angular';
import { UiService } from '@core/services/ui.service';

@Component({
  selector: 'app-highlights-given',
  templateUrl: './highlights-given.page.html',
  styleUrls: ['./highlights-given.page.css'],
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
    CommonModule,
    FormsModule,
    IssueListComponent,
    LucideAngularModule,
    RouterLink,
  ],
})
export class HighlightsGivenPage implements OnInit, OnDestroy {
  userService = inject(UserService);
  authService = inject(AuthService);
  uiService = inject(UiService);
  toastController = inject(ToastController);
  canGetMore = signal(true);
  backIcon = ArrowLeft;

  ngOnInit(): void {
    this.userService.isLoading.set(true);

    this.userService
      .getHighlightsGiven(this.authService.loggedUserData()!.id)
      .subscribe({
        next: (response) => this.userService.issueList.update(() => response),
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

    this.userService
      .getHighlightsGiven(this.authService.loggedUserData()!.id)
      .subscribe({
        next: (response) => this.userService.issueList.update(() => response),
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
      .getHighlightsGiven(this.authService.loggedUserData()!.id, 5, nextPage)
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

  ngOnDestroy(): void {
    this.userService
      .getUserIssues(
        this.authService.loggedUserData()!.id,
        this.userService.AMOUNT_OF_ISSUES_IN_REPORT_PAGE,
      )
      .subscribe({
        next: (response) => {
          this.userService.issueList.update(() => response);
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
