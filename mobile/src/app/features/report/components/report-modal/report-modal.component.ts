import { Component, inject, input, OnInit } from '@angular/core';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { Geolocation } from '@capacitor/geolocation';
import { IssueService } from '@core/services/issue.service';
import { CategoryListComponent } from '@features/report/components/category-list/category-list.component';
import { CreateIssueDto } from '@shared/dto/issue.dto';

@Component({
  selector: 'app-report-modal',
  templateUrl: './report-modal.component.html',
  styleUrls: ['./report-modal.component.scss'],
  imports: [
    IonButton,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CategoryListComponent,
  ],
})
export class ReportModalComponent implements OnInit {
  issueService = inject(IssueService);
  modalController = inject(ModalController);
  photo = input('');
  selectedCategory: string = '';
  DEFAULT_STATUS: string = 'PENDING';

  constructor() {}

  ngOnInit(): void {}

  cancel(): Promise<boolean> {
    return this.modalController.dismiss(null, 'cancel');
  }

  async sendReport(): Promise<void> {
    const coordinates = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
    });
    const issue: CreateIssueDto = {
      photo: this.photo.toString(),
      status: this.DEFAULT_STATUS,
      coordinates: `${coordinates.coords.latitude},${coordinates.coords.longitude}`,
      category: this.selectedCategory,
      user: '1',
    };

    this.issueService.createIssue(issue).subscribe((result) => {
      if (result.error) console.log('ERROR', result.error);
      this.modalController.dismiss(result.data, 'confirm');

      this.issueService.issues.update((current) => ({
        ...current,
        data: [...(current.data ?? []), result.data!],
      }));
    });
  }
}
