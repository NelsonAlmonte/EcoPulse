import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { MapViewComponent } from '@features/map/components/map-view/map-view.component';
import { IssueService } from '@core/services/issue.service';
import { DynamicIssuesModalComponent } from '@features/map/components/dynamic-issues-modal/dynamic-issues-modal.component';
import { ChevronUpIcon, LucideAngularModule } from 'lucide-angular';
import { IssueListComponent } from '@features/report/components/issue-list/issue-list.component';

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
    DynamicIssuesModalComponent,
    LucideAngularModule,
  ],
})
export class MapPage implements OnInit {
  issueService = inject(IssueService);
  modalController = inject(ModalController);
  chevronUpIcon = ChevronUpIcon;

  constructor() {}

  ngOnInit() {
    // this.issueService.getIssues();
  }

  async openDynamicIssuesModal(): Promise<void> {
    const modal = await this.modalController.create({
      component: IssueListComponent,
      initialBreakpoint: 0.25,
      breakpoints: [0.25, 0.5, 0.75],
      backdropDismiss: false,
      backdropBreakpoint: 0.5,
    });
    await modal.present();
  }
}
