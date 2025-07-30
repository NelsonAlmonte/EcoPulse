import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
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
import { AuthService } from '@core/services/auth.service';
import { UserService } from '@core/services/user.service';
import { CameraIcon, LucideAngularModule } from 'lucide-angular';
import { filter } from 'rxjs';

@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.css'],
  standalone: true,
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
  authService = inject(AuthService);
  userService = inject(UserService);
  modalController = inject(ModalController);
  router = inject(Router);
  cameraIcon = CameraIcon;

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.urlAfterRedirects.includes('/report')) {
          this.userService.getUserIssues(this.authService.loggedUserData().id);
        }
      });
    // const image = `https://ionicframework.com/docs/img/demos/card-media.png`;
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
