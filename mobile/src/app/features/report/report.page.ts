import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Camera, CameraDirection } from '@capacitor/camera';
import {
  IonContent,
  IonHeader,
  IonRefresher,
  IonRefresherContent,
  IonRippleEffect,
  IonTitle,
  IonToolbar,
  IonButtons,
  ModalController,
  RefresherCustomEvent,
  ToastController,
} from '@ionic/angular/standalone';
import { ReportModalComponent } from '@features/report/components/report-modal/report-modal.component';
import { LocationPreviewComponent } from '@features/report/components/location-preview/location-preview.component';
import { IssueListComponent } from '@features/report/components/issue-list/issue-list.component';
import { AuthService } from '@core/services/auth.service';
import { UserService } from '@core/services/user.service';
import { LocationService } from '@core/services/location.service';
import { UiService } from '@core/services/ui.service';
import {
  ArrowRight,
  BellIcon,
  CameraIcon,
  LucideAngularModule,
} from 'lucide-angular';

@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.css'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonRefresher,
    IonRefresherContent,
    IonButtons,
    CommonModule,
    FormsModule,
    LocationPreviewComponent,
    IssueListComponent,
    IonRippleEffect,
    LucideAngularModule,
    RouterLink,
  ],
})
export class ReportPage {
  authService = inject(AuthService);
  userService = inject(UserService);
  uiService = inject(UiService);
  locationService = inject(LocationService);
  modalController = inject(ModalController);
  toastController = inject(ToastController);
  router = inject(Router);
  cameraIcon = CameraIcon;
  arrowRight = ArrowRight;
  notificationIcon = BellIcon;

  ionViewWillEnter(): void {
    if (
      !this.userService.issueList().data.length &&
      this.uiService.hasConnection()
    ) {
      this.userService.isLoading.set(true);

      this.userService
        .getUserIssues(
          this.authService.user()!.id,
          this.userService.AMOUNT_OF_ISSUES_IN_REPORT_PAGE
        )
        .subscribe((response) => {
          this.userService.isLoading.set(false);
          this.userService.issueList.update(() => response);
        });
    }
  }

  async takePicture(): Promise<void> {
    if (!this.locationService.hasLocationPermission()) {
      await this.uiService.showToast(
        'Debes aceptar los permisos de ubicación para poder realizar reportes.',
        'take-picture-button'
      );

      return;
    }

    try {
      const image = await Camera.takePhoto({
        quality: 40,
        targetWidth: 1280,
        targetHeight: 720,
        includeMetadata: true,
        editable: 'no',
        saveToGallery: false,
        cameraDirection: CameraDirection.Rear,
      });
      const dataUrl = `data:image/${image.metadata!.format};base64,${
        image.thumbnail
      }`;

      this.openReportModal(dataUrl);
    } catch (error) {
      await this.uiService.showToast(
        'Ocurrio un error al abrir la cámara. Intentalo de nuevo.',
        'take-picture-button'
      );
    }
  }

  async openReportModal(photo: string): Promise<void> {
    const modal = await this.modalController.create({
      component: ReportModalComponent,
      componentProps: {
        photo: photo,
      },
      cssClass: 'report-modal',
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
        this.authService.user()!.id,
        this.userService.AMOUNT_OF_ISSUES_IN_REPORT_PAGE
      )
      .subscribe({
        next: (response) => this.userService.issueList.update(() => response),
        error: async () => {
          await this.uiService.showToast(
            'Ocurrió un error al obtener los reportes.',
            'take-picture-button'
          );
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
