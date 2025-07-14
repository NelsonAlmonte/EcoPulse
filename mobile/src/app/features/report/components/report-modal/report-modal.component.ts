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
import { switchMap } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

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
      photo: '',
      status: this.DEFAULT_STATUS,
      latitude: coordinates.coords.latitude.toString(),
      longitude: coordinates.coords.longitude.toString(),
      category: this.selectedCategory,
      user: '1',
    };
    const formData = new FormData();

    formData.append(
      'photo',
      this.dataUrlToFile(this.photo.toString(), `issue-${uuidv4()}.jpg`)
    );

    this.issueService
      .uploadPhoto(formData)
      .pipe(
        switchMap((uploadedPhoto) => {
          issue.photo = `${uploadedPhoto.data!.fullPath}`;
          return this.issueService.createIssue(issue);
        })
      )
      .subscribe((result) => {
        if (result.error) console.log('ERROR', result.error);
        this.modalController.dismiss(result.data, 'confirm');

        this.issueService.issues.update((current) => ({
          ...current,
          data: [...(current.data ?? []), result.data!],
        }));
      });
  }

  dataUrlToFile(dataUrl: string, filename: string): File {
    const [metadata, base64] = dataUrl.split(',');
    const mime = metadata.match(/:(.*?);/)![1];
    const binary = atob(base64);
    const array = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
      array[i] = binary.charCodeAt(i);
    }

    return new File([array], filename, { type: mime });
  }
}
