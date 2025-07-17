import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '@core/services/user.service';
import { RelativeTimePipe } from '@shared/pipes/relative-time.pipe';
import { LucideAngularModule, MegaphoneIcon } from 'lucide-angular';

@Component({
  selector: 'app-issue-list',
  templateUrl: './issue-list.component.html',
  styleUrls: ['./issue-list.component.css'],
  imports: [RelativeTimePipe, LucideAngularModule],
})
export class IssueListComponent implements OnInit {
  userService = inject(UserService);
  headsUpIcon = MegaphoneIcon;

  ngOnInit() {
    // TODO: Get logged in user id
    this.userService.getUserIssues('1');
  }
}
