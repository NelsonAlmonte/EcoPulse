import { Component, inject, input } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { IssueService } from '@core/services/issue.service';
import { UserService } from '@core/services/user.service';
import { IssueDetailComponent } from '@features/report/components/issue-detail/issue-detail.component';
import { IssueDetailLoadingComponent } from '@shared/components/issue-detail-loading/issue-detail-loading.component';
import { DEFAULT_STATUS } from '@shared/constants/system.constant';
import { Issue } from '@shared/models/issue.model';
import { List } from '@shared/models/response.model';
import {
  CheckCircleIcon,
  CircleUserIcon,
  ClockIcon,
  FolderOpenIcon,
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
export class IssueListComponent {
  userService = inject(UserService);
  issueService = inject(IssueService);
  authService = inject(AuthService);
  issueList = input<List<Issue[]>>();
  DEFAULT_STATUS = DEFAULT_STATUS;
  checkCircle = CheckCircleIcon;
  clockIcon = ClockIcon;
  headsUpIcon = MegaphoneIcon;
  userIcon = CircleUserIcon;
  emptyIcon = FolderOpenIcon;
}
