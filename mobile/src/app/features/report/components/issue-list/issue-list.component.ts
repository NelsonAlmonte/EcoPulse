import { Component, inject, input } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { IssueService } from '@core/services/issue.service';
import { UiService } from '@core/services/ui.service';
import { UserService } from '@core/services/user.service';
import { IssueDetailComponent } from '@features/report/components/issue-detail/issue-detail.component';
import { IssueDetailLoadingComponent } from '@shared/components/issue-detail-loading/issue-detail-loading.component';
import { Issue } from '@shared/models/issue.model';
import { List } from '@shared/models/response.model';
import {
  FolderOpenIcon,
  LucideAngularModule,
  WifiOffIcon,
} from 'lucide-angular';
import { AlertComponent } from '@shared/components/alert/alert.component';

@Component({
  selector: 'app-issue-list',
  templateUrl: './issue-list.component.html',
  styleUrls: ['./issue-list.component.css'],
  imports: [
    IssueDetailComponent,
    IssueDetailLoadingComponent,
    LucideAngularModule,
    AlertComponent,
  ],
})
export class IssueListComponent {
  userService = inject(UserService);
  issueService = inject(IssueService);
  authService = inject(AuthService);
  uiService = inject(UiService);
  issueList = input<List<Issue[]>>();
  emptyIcon = FolderOpenIcon;
  noConnectionIcon = WifiOffIcon;
}
