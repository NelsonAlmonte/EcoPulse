import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { MapViewComponent } from '@features/map/components/map-view/map-view.component';
import { IssueService } from '@core/services/issue.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.css'],
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    MapViewComponent,
  ],
})
export class MapPage implements OnInit {
  issueService = inject(IssueService);

  constructor() {}

  ngOnInit() {
    // this.issueService.getIssues();
  }
}
