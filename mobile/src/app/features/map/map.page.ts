import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonProgressBar,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { MapViewComponent } from '@features/map/components/map-view/map-view.component';
import { IssueService } from '@core/services/issue.service';
import { DynamicIssuesModalComponent } from '@features/map/components/dynamic-issues-modal/dynamic-issues-modal.component';
import { ChevronUpIcon, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.css'],
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonProgressBar,
    CommonModule,
    FormsModule,
    MapViewComponent,
    LucideAngularModule,
  ],
})
export class MapPage {
  issueService = inject(IssueService);
  modalController = inject(ModalController);
  chevronUpIcon = ChevronUpIcon;

  async openDynamicIssuesModal(): Promise<void> {
    const modal = await this.modalController.create({
      component: DynamicIssuesModalComponent,
      initialBreakpoint: 0.5,
      breakpoints: [0, 0.5, 1],
      backdropDismiss: false,
      backdropBreakpoint: 0.75,
      expandToScroll: true,
    });

    modal.present();
  }
}
