import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Camera, CameraResultType } from '@capacitor/camera';
import {
  IonButton,
  IonContent,
  IonFab,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cameraOutline } from 'ionicons/icons';
import { ReportModalComponent } from '@features/report/components/report-modal/report-modal.component';

@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonIcon,
    IonFab,
    IonIcon,
    IonButton,
    CommonModule,
    FormsModule,
  ],
})
export class ReportPage implements OnInit {
  modalController = inject(ModalController);
  icon = 'add-circle-outline';
  constructor() {
    addIcons({ cameraOutline });
  }

  ngOnInit(): void {
    const image = `https://ionicframework.com/docs/img/demos/card-media.png`;
    // this.openReportModal(image);
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
