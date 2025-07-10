import { Component, input, OnInit } from '@angular/core';

@Component({
  selector: 'app-issue-detail',
  templateUrl: './issue-detail.component.html',
  styleUrls: ['./issue-detail.component.scss'],
})
export class IssueDetailComponent implements OnInit {
  latitude = input.required<number>();
  longitude = input.required<number>();

  constructor() {}

  ngOnInit() {
    console.log(this.latitude);
    console.log(this.longitude);
  }
}
