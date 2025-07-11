import { Component, inject, input, OnInit } from '@angular/core';
import { IssueService } from '@core/services/issue.service';
import {
  IonAvatar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonRow,
} from '@ionic/angular/standalone';
import { RelativeTimePipe } from '@shared/pipes/relative-time.pipe';

@Component({
  selector: 'app-issue-detail',
  templateUrl: './issue-detail.component.html',
  styleUrls: ['./issue-detail.component.scss'],
  imports: [
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonAvatar,
    IonGrid,
    IonRow,
    IonCol,
    RelativeTimePipe,
  ],
})
export class IssueDetailComponent implements OnInit {
  issueService = inject(IssueService);
  latitude = input.required<number>();
  longitude = input.required<number>();

  ngOnInit() {
    this.issueService.getIssueByCoords(
      this.latitude.toString(),
      this.longitude.toString()
    );
  }

  get issue() {
    return this.issueService.issue().data!;
  }
}
