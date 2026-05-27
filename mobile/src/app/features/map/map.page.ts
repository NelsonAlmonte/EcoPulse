import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonRippleEffect,
  ModalController,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonActionSheet,
} from '@ionic/angular/standalone';
import { MapViewComponent } from '@features/map/components/map-view/map-view.component';
import { IssueService } from '@core/services/issue.service';
import { DynamicIssuesModalComponent } from '@features/map/components/dynamic-issues-modal/dynamic-issues-modal.component';
import {
  ArrowUpDown,
  ChevronUpIcon,
  LucideAngularModule,
} from 'lucide-angular';
import { OverlayEventDetail } from '@ionic/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.css'],
  imports: [
    IonContent,
    IonRippleEffect,
    CommonModule,
    FormsModule,
    MapViewComponent,
    LucideAngularModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonActionSheet,
  ],
})
export class MapPage {
  issueService = inject(IssueService);
  modalController = inject(ModalController);
  actionSheetButtons = [
    {
      text: 'Más recientes',
      data: {
        value: 'createdAt:desc',
      },
    },
    {
      text: 'Más antiguos',
      data: {
        value: 'createdAt:asc',
      },
    },
    {
      text: 'Más destacados',
      data: {
        value: 'highlights:desc',
      },
    },
    {
      text: 'Menos destacados',
      data: {
        value: 'highlights:asc',
      },
    },
  ];
  orderBy = 'createdAt:desc';
  chevronUpIcon = ChevronUpIcon;
  orderIcon = ArrowUpDown;

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

  orderIssues(event: CustomEvent<OverlayEventDetail>): void {
    if (!event.detail.data) return;

    this.issueService.order.set(event.detail.data.value);
  }
}
