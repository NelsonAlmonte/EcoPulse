import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Camera, CameraResultType } from '@capacitor/camera';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { ReportModalComponent } from '@features/report/components/report-modal/report-modal.component';
import { LocationPreviewComponent } from '@features/report/components/location-preview/location-preview.component';
import { IssueListComponent } from '@features/report/components/issue-list/issue-list.component';
import { CameraIcon, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.css'],
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    LocationPreviewComponent,
    IssueListComponent,
    LucideAngularModule,
  ],
})
export class ReportPage implements OnInit {
  modalController = inject(ModalController);
  cameraIcon = CameraIcon;

  ngOnInit(): void {
    const image = `https://ionicframework.com/docs/img/demos/card-media.png`;
    this.openReportModal(image);
  }

  async takePicture(): Promise<void> {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      saveToGallery: false,
    });

    this.openReportModal(image.dataUrl!);
  }

  async openReportModal(photo: string): Promise<void> {
    const modal = await this.modalController.create({
      component: ReportModalComponent,
      componentProps: {
        photo: photo,
      },
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      console.log(data);
    }
  }
}
