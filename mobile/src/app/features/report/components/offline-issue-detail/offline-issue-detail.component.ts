import { Component, input } from '@angular/core';
import { OfflineIssue } from '@shared/dto/issue.dto';
import { IssueCardComponent } from '@features/report/components/issue-card/issue-card.component';
import { IonRippleEffect } from '@ionic/angular/standalone';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-offline-issue-detail',
  templateUrl: './offline-issue-detail.component.html',
  styleUrls: ['./offline-issue-detail.component.css'],
  imports: [IssueCardComponent, IonRippleEffect, LucideAngularModule],
})
export class OfflineIssueDetailComponent {
  issue = input.required<OfflineIssue | null>();
}
