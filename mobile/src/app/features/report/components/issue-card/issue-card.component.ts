import { Component, inject, input } from '@angular/core';
import { EllipsisIcon, LucideAngularModule, User } from 'lucide-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { RelativeTimePipe } from '@shared/pipes/relative-time.pipe';
import { Issue } from '@shared/models/issue.model';

@Component({
  selector: 'app-issue-card',
  templateUrl: './issue-card.component.html',
  styleUrls: ['./issue-card.component.css'],
  imports: [LucideAngularModule, RelativeTimePipe],
})
export class IssueCardComponent {
  issue = input.required<Issue>();
  sanitizer = inject(DomSanitizer);
  optionsIcon = EllipsisIcon;
  userIcon = User;
}
