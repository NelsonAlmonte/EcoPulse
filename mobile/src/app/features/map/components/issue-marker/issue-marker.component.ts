import { Component, input } from '@angular/core';
import { Issue } from '@shared/models/issue.model';
import { LucideAngularModule, StarIcon } from 'lucide-angular';

@Component({
  selector: 'app-issue-marker',
  templateUrl: './issue-marker.component.html',
  styleUrls: ['./issue-marker.component.css'],
  imports: [LucideAngularModule],
})
export class IssueMarkerComponent {
  issue = input.required<Issue>();
  highlightIcon = StarIcon;
}
