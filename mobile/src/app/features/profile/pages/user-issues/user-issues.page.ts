import { Component, inject, OnInit, signal } from '@angular/core';
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
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
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
export class UserIssuesPage implements OnInit {
  router = inject(Router);
  userService = inject(UserService);
  authService = inject(AuthService);
  toastController = inject(ToastController);
  canGetMore = signal(true);

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.urlAfterRedirects.includes('/user-issues')) {
          this.userService
            .getUserIssues(this.authService.loggedUserData()!.id)
            .subscribe({
              next: (response) =>
                this.userService.issueList.update(() => response),
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
}
