import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
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
    CommonModule,
    FormsModule,
    IssueListComponent,
  ],
})
export class UserIssuesPage implements OnInit {
  router = inject(Router);
  userService = inject(UserService);
  authService = inject(AuthService);

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.urlAfterRedirects.includes('/user-issues')) {
          this.userService.getUserIssues(this.authService.loggedUserData()!.id);
        }
      });
  }
}
