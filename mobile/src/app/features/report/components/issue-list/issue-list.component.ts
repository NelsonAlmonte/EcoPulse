import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '@core/services/user.service';
import { IssueDetailComponent } from '@features/report/components/issue-detail/issue-detail.component';
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
  imports: [IssueDetailComponent, LucideAngularModule],
})
export class IssueListComponent implements OnInit {
  userService = inject(UserService);
  DEFAULT_STATUS = DEFAULT_STATUS;
  checkCircle = CheckCircleIcon;
  clockIcon = ClockIcon;
  headsUpIcon = MegaphoneIcon;
  userIcon = CircleUserIcon;

  ngOnInit() {
    // TODO: Get logged in user id
    this.userService.getUserIssues('1');
  }
}
