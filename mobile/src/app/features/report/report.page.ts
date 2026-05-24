import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Camera, CameraDirection } from '@capacitor/camera';
import {
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonRippleEffect,
  ModalController,
  RefresherCustomEvent,
  ToastController,
} from '@ionic/angular/standalone';
import { ReportModalComponent } from '@features/report/components/report-modal/report-modal.component';
import { LocationPreviewComponent } from '@features/report/components/location-preview/location-preview.component';
import { IssueListComponent } from '@features/report/components/issue-list/issue-list.component';
import { AuthService } from '@core/services/auth.service';
import { UserService } from '@core/services/user.service';
import { ArrowRight, CameraIcon, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.css'],
  standalone: true,
  imports: [
    IonContent,
    IonRefresher,
    IonRefresherContent,
    CommonModule,
    FormsModule,
    LocationPreviewComponent,
    IssueListComponent,
    IonRippleEffect,
    LucideAngularModule,
  ],
})
export class ReportPage implements OnInit {
  authService = inject(AuthService);
  userService = inject(UserService);
  modalController = inject(ModalController);
  toastController = inject(ToastController);
  router = inject(Router);
  cameraIcon = CameraIcon;
  arrowRight = ArrowRight;

  ngOnInit(): void {
    this.userService
      .getUserIssues(
        this.authService.loggedUserData()!.id,
        this.userService.AMOUNT_OF_ISSUES_IN_REPORT_PAGE,
      )
      .subscribe((response) => {
        this.userService.isLoading.set(false);
        this.userService.issueList.update(() => response);
      });
  }

  async takePicture(): Promise<void> {
    try {
      const image = await Camera.takePhoto({
        quality: 60,
        targetWidth: 1280,
        targetHeight: 720,
        includeMetadata: true,
        editable: 'no',
        saveToGallery: false,
        cameraDirection: CameraDirection.Rear,
      });
      const dataUrl = `data:image/${image.metadata!.format};base64,${image.thumbnail}`;

      this.openReportModal(dataUrl);
    } catch (error) {
      const toast = await this.toastController.create({
        message: 'Ocurrio un error al abrir la cámara. Intentalo de nuevo.',
        duration: 4000,
        position: 'bottom',
        animated: true,
      });

      toast.present();
      console.log(error);
    }
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

  refreshLatestIssues(event: RefresherCustomEvent): void {
    this.userService
      .getUserIssues(
        this.authService.loggedUserData()!.id,
        this.userService.AMOUNT_OF_ISSUES_IN_REPORT_PAGE,
      )
      .subscribe({
        next: (response) => this.userService.issueList.update(() => response),
        error: async (err) => {
          console.log(err);
          const toast = await this.toastController.create({
            message: 'Ocurrió un error al obtener los reportes.',
            duration: 4000,
            position: 'bottom',
          });

          toast.present();
        },
        complete: () => {
          event.target.complete();
          this.userService.isLoading.set(false);
        },
      });
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }
}
