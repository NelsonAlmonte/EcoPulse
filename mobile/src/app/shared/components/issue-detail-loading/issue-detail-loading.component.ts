import { Component } from '@angular/core';
import { CircleUserIcon, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-issue-detail-loading',
  templateUrl: './issue-detail-loading.component.html',
  styleUrls: ['./issue-detail-loading.component.css'],
  standalone: true,
  imports: [LucideAngularModule],
})
export class IssueDetailLoadingComponent {
  userIcon = CircleUserIcon;
}
