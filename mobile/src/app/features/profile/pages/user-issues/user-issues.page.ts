import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  InfiniteScrollCustomEvent,
  IonBackButton,
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
} from '@ionic/angular/standalone';
import { IssueListComponent } from '@features/report/components/issue-list/issue-list.component';
import { UserService } from '@core/services/user.service';
import { AuthService } from '@core/services/auth.service';

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
    IonBackButton,
    IonRefresher,
    IonRefresherContent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    CommonModule,
    FormsModule,
    IssueListComponent,
  ],
})
export class UserIssuesPage implements OnInit, OnDestroy {
  userService = inject(UserService);
  authService = inject(AuthService);
  toastController = inject(ToastController);
  canGetMore = signal(true);

  ngOnInit(): void {
    this.userService
      .getUserIssues(this.authService.loggedUserData()!.id)
      .subscribe({
        next: (response) => this.userService.issueList.update(() => response),
        error: async (err) => {
          console.log(err);
          const toast = await this.toastController.create({
            message: 'Ocurrió un error al obtener los reportes.',
            duration: 4000,
            position: 'bottom',
          });

          toast.present();
        },
        complete: () => this.userService.isLoading.set(false),
      });
  }

  refreshUserIssues(event: RefresherCustomEvent): void {
    this.canGetMore.set(true);

    this.userService
      .getUserIssues(this.authService.loggedUserData()!.id)
      .subscribe({
        next: (response) => this.userService.issueList.update(() => response),
        error: async (err) => {
          console.log(err);
          const toast = await this.toastController.create({
            message: 'Ocurrió un error al obtener los reportes.',
            duration: 4000,
            position: 'bottom',
          });

          toast.present();
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
      .getUserIssues(this.authService.loggedUserData()!.id, 5, nextPage)
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
          console.log(err);
          const toast = await this.toastController.create({
            message: 'Ocurrió un error al obtener los reportes.',
            duration: 4000,
            position: 'bottom',
          });

          toast.present();
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
      .subscribe((response) => {
        this.userService.isLoading.set(false);
        this.userService.issueList.update(() => response);
      });
  }
}
