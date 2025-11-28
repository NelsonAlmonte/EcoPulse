import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { Camera, CameraResultType } from '@capacitor/camera';
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
  ModalController,
  RefresherCustomEvent,
  ToastController,
} from '@ionic/angular/standalone';
import { ReportModalComponent } from '@features/report/components/report-modal/report-modal.component';
import { LocationPreviewComponent } from '@features/report/components/location-preview/location-preview.component';
import { IssueListComponent } from '@features/report/components/issue-list/issue-list.component';
import { AuthService } from '@core/services/auth.service';
import { UserService } from '@core/services/user.service';
import { CameraIcon, LucideAngularModule } from 'lucide-angular';
import { filter } from 'rxjs';
import * as lucideIconsRaw from 'lucide-static';
import { addIcons } from 'ionicons';

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
    IonRefresher,
    IonRefresherContent,
    CommonModule,
    FormsModule,
    LocationPreviewComponent,
    IssueListComponent,
    LucideAngularModule,
    IonIcon,
  ],
})
export class ReportPage implements OnInit {
  authService = inject(AuthService);
  userService = inject(UserService);
  modalController = inject(ModalController);
  toastController = inject(ToastController);
  router = inject(Router);
  cameraIcon = CameraIcon;
  AMOUNT_OF_ISSUES = 3;
  lucideIcons = lucideIconsRaw as Record<string, string>;
  icon = 'Skull';

  constructor() {
    addIcons(this.lucideIcons);
  }

  ngOnInit(): void {
    this.userService
      .getUserIssues(
        this.authService.loggedUserData()!.id,
        this.AMOUNT_OF_ISSUES
      )
      .subscribe((response) => {
        this.userService.isLoading.set(false);
        this.userService.issueList.update(() => response);
      });
    // this.router.events
    //   .pipe(filter((event) => event instanceof NavigationEnd))
    //   .subscribe((event: NavigationEnd) => {
    //     if (event.urlAfterRedirects.includes('/report')) {
    //       this.userService.getUserIssues(
    //         this.authService.loggedUserData().id,
    //         this.AMOUNT_OF_ISSUES
    //       );
    //     }
    //   });
    // const image = `https://ionicframework.com/docs/img/demos/card-media.png`;
    // this.openReportModal(image);
  }

  async takePicture(): Promise<void> {
    const image = await Camera.getPhoto({
      quality: 60,
      width: 1280,
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

  refreshLatestIssues(event: RefresherCustomEvent): void {
    this.userService
      .getUserIssues(
        this.authService.loggedUserData()!.id,
        this.AMOUNT_OF_ISSUES
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
}
