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
  MegaphoneIcon,
} from 'lucide-angular';

@Component({
  selector: 'app-issue-detail',
  templateUrl: './issue-detail.component.html',
  styleUrls: ['./issue-detail.component.css'],
  imports: [LucideAngularModule, RelativeTimePipe],
})
export class IssueDetailComponent {
  issueService = inject(IssueService);
  issue = input.required<Issue>();
  DEFAULT_STATUS = DEFAULT_STATUS;
  checkCircle = CheckCircleIcon;
  clockIcon = ClockIcon;
  headsUpIcon = MegaphoneIcon;
  userIcon = CircleUserIcon;
}
