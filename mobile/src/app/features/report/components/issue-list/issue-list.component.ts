import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { UserService } from '@core/services/user.service';
import { IssueDetailComponent } from '@features/report/components/issue-detail/issue-detail.component';
import { IssueDetailLoadingComponent } from '@shared/components/issue-detail-loading/issue-detail-loading.component';
import { DEFAULT_STATUS } from '@shared/constants/system.constant';
import {
  CheckCircleIcon,
  CircleUserIcon,
  ClockIcon,
  LucideAngularModule,
  MegaphoneIcon,
} from 'lucide-angular';

@Component({
  selector: 'app-issue-list',
  templateUrl: './issue-list.component.html',
  styleUrls: ['./issue-list.component.css'],
  imports: [
    IssueDetailComponent,
    IssueDetailLoadingComponent,
    LucideAngularModule,
  ],
})
export class IssueListComponent implements OnInit {
  userService = inject(UserService);
  authService = inject(AuthService);
  DEFAULT_STATUS = DEFAULT_STATUS;
  checkCircle = CheckCircleIcon;
  clockIcon = ClockIcon;
  headsUpIcon = MegaphoneIcon;
  userIcon = CircleUserIcon;

  ngOnInit() {
    // this.userService.getUserIssues(this.authService.loggedUserData().id);
  }
}
