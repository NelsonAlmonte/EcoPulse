import { Component, inject, input } from '@angular/core';
import { IssueService } from '@core/services/issue.service';
import { DEFAULT_STATUS } from '@shared/constants/system.constant';
import { Issue } from '@shared/models/issue.model';
import { RelativeTimePipe } from '@shared/pipes/relative-time.pipe';
import {
  CheckCircleIcon,
  CircleUserIcon,
  ClockIcon,
  LucideAngularModule,
} from 'lucide-angular';
import { HighlightButtonComponent } from '@features/report/components/highlight-button/highlight-button.component';
import { IssueDetailLoadingComponent } from '@shared/components/issue-detail-loading/issue-detail-loading.component';

@Component({
  selector: 'app-issue-detail',
  templateUrl: './issue-detail.component.html',
  styleUrls: ['./issue-detail.component.css'],
  imports: [
    LucideAngularModule,
    HighlightButtonComponent,
    IssueDetailLoadingComponent,
    RelativeTimePipe,
  ],
})
export class IssueDetailComponent {
  issueService = inject(IssueService);
  issue = input.required<Issue>();
  DEFAULT_STATUS = DEFAULT_STATUS;
  checkCircle = CheckCircleIcon;
  clockIcon = ClockIcon;
  userIcon = CircleUserIcon;

  get issueData() {
    return this.issue()?.id ? this.issue() : this.issueService.issue().data;
  }
}
