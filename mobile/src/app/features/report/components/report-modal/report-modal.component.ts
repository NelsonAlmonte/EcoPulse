import { Component, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonFooter,
  IonHeader,
  IonLabel,
  IonRippleEffect,
  IonSegment,
  IonSegmentButton,
  IonSegmentContent,
  IonSegmentView,
  IonTextarea,
  IonToolbar,
  ModalController,
  SegmentChangeEventDetail,
  ToastController,
} from '@ionic/angular/standalone';
import { catchError, from, Observable, switchMap, throwError } from 'rxjs';
import { Geolocation } from '@capacitor/geolocation';
import { IssueService } from '@core/services/issue.service';
import { AuthService } from '@core/services/auth.service';
import { CategoryListComponent } from '@features/report/components/category-list/category-list.component';
import { LocationPreviewComponent } from '@features/report/components/location-preview/location-preview.component';
import { v4 as uuidv4 } from 'uuid';
import {
  AlertTriangleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  BanIcon,
  ImageIcon,
  LucideAngularModule,
  MapPinIcon,
  SaveIcon,
  SendIcon,
} from 'lucide-angular';
import { UserService } from '@core/services/user.service';
import { UiService } from '@core/services/ui.service';
import { OfflineService } from '@core/services/offline.service';
import { Issue } from '@shared/models/issue.model';
import { List } from '@shared/models/response.model';
import { dataUrlToFile } from '@shared/utils/file.util';
import { Category } from '@shared/models/category.model';
import { CreateIssueDto } from '@shared/dto/issue.dto';
import { DEFAULT_STATUS } from '@shared/constants/system.constant';
import { User } from '@shared/models/user.model';

@Component({
  selector: 'app-report-modal',
  templateUrl: './report-modal.component.html',
  styleUrls: ['./report-modal.component.css'],
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonSegmentView,
    IonSegmentContent,
    IonTextarea,
    IonFooter,
    IonRippleEffect,
    CategoryListComponent,
    LocationPreviewComponent,
    FormsModule,
    LucideAngularModule,
  ],
})
export class ReportModalComponent {
  issueService = inject(IssueService);
  authService = inject(AuthService);
  userService = inject(UserService);
  uiService = inject(UiService);
  offlineService = inject(OfflineService);
  modalController = inject(ModalController);
  toastController = inject(ToastController);
  photo = input.required<string>();
  comment: string = '';
  selectedCategory: Category | null = null;
  currentSegment: string = 'photo';
  segments: string[] = ['photo', 'location', 'categories'];
  nextIcon = ArrowRightIcon;
  prevIcon = ArrowLeftIcon;
  sendIcon = SendIcon;
  saveIcon = SaveIcon;
  cancelIcon = BanIcon;
  photoIcon = ImageIcon;
  placeIcon = MapPinIcon;
  issueIcon = AlertTriangleIcon;
  buttonOptions = {
    default: {
      text: 'Enviar',
      isDisabled: false,
    },
    loading: {
      text: 'Enviando...',
      isDisabled: true,
    },
  };

  cancel(): Promise<boolean> {
    return this.modalController.dismiss(null, 'cancel');
  }

  //NOTE: Test
  getRandomCoordinatesInDominicanRepublic(): {
    latitude: number;
    longitude: number;
  } {
    // Algunas regiones terrestres de RD aproximadas (simplificado)
    const landAreas = [
      { minLat: 18.4, maxLat: 19.9, minLng: -71.8, maxLng: -69.9 }, // Norte-centro
      { minLat: 18.0, maxLat: 18.6, minLng: -71.5, maxLng: -70.0 }, // Sur
      { minLat: 18.4, maxLat: 18.7, minLng: -70.0, maxLng: -68.5 }, // Este
    ];

    const area = landAreas[Math.floor(Math.random() * landAreas.length)];

    const latitude = Math.random() * (area.maxLat - area.minLat) + area.minLat;
    const longitude = Math.random() * (area.maxLng - area.minLng) + area.minLng;

    return { latitude, longitude };
  }

  async sendIssue(): Promise<void> {
    await this.uiService.showLoading('Enviando reporte...');

    const issue = await this.buildIssue();
    const formData = new FormData();

    formData.append(
      'photo',
      dataUrlToFile(this.photo().toString(), `issue-${uuidv4()}.jpg`)
    );

    this.issueService
      .uploadPhoto(formData)
      .pipe(
        switchMap((response) => {
          issue.photo = `${response.fullPath}`;

          return this.issueService.createIssue(issue);
        }),
        catchError((err) => {
          this.saveOfflineIssue();

          return from(this.uiService.hideLoading()).pipe(
            switchMap(() => this.handleError(err))
          );
        })
      )
      .subscribe(async (response) => {
        await this.uiService.hideLoading();

        this.modalController.dismiss(response, 'confirm');

        this.userService.issueList.update((current) =>
          this.updateUserIssues(current, response)
        );

        await this.uiService.showToast(
          'Tu reporte se ha enviado correctamente.'
        );
      });
  }

  async saveOfflineIssue(): Promise<void> {
    await this.uiService.showLoading('Guardando reporte...');

    const issue = await this.buildIssue();
    let user = this.userService.user();

    if (!user) {
      const rawUser = localStorage.getItem('user');

      if (!rawUser) {
        await this.uiService.showToast(
          'Ocurrió un error al obtener tu información.'
        );
        return;
      }

      user = JSON.parse(rawUser) as User;
    }

    const offlineIssue: Issue = {
      id: uuidv4(),
      photo: issue.photo,
      status: issue.status,
      latitude: issue.latitude,
      longitude: issue.latitude,
      comment: issue.comment,
      categoryId: issue.category,
      userId: user.id,
      category: this.selectedCategory!,
      createdAt: new Date().toISOString(),
      user,
      highlights: 0,
      hasCurrentUserHighlight: false,
    };

    this.offlineService.saveOfflineIssue(offlineIssue);

    await this.uiService.hideLoading();

    this.modalController.dismiss(offlineIssue, 'confirm');

    await this.uiService.showToast(
      'Reporte guardado correctamente. Podrás enviarlo cuando tengas conexión a Internet.'
    );
  }

  async buildIssue(): Promise<CreateIssueDto> {
    const coordinates = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
    });
    const { latitude, longitude } =
      this.getRandomCoordinatesInDominicanRepublic();
    const issue: CreateIssueDto = {
      photo: this.photo().toString(),
      status: DEFAULT_STATUS,
      latitude: latitude,
      longitude: longitude,
      // latitude: coordinates.coords.latitude,
      // longitude: coordinates.coords.longitude,
      comment: this.comment,
      category: this.selectedCategory!.id,
      user: this.authService.loggedUserData()!.id,
    };

    return issue;
  }

  updateUserIssues(currentData: List<Issue[]>, response: Issue) {
    const updatedData = [
      response,
      ...(currentData.data!.length >= 3
        ? currentData.data!.slice(0, -1) ?? []
        : currentData.data!),
    ];

    return {
      ...currentData,
      data: updatedData,
    };
  }

  next(): void {
    const index = this.segments.indexOf(this.currentSegment);
    if (index < this.segments.length - 1) {
      this.currentSegment = this.segments[index + 1];
    }
  }

  back(): void {
    const index = this.segments.indexOf(this.currentSegment);
    if (index > 0) {
      this.currentSegment = this.segments[index - 1];
    }
  }

  customCounterFormatter(inputLength: number, maxLength: number): string {
    return `${maxLength - inputLength} caracteres restantes`;
  }

  changeCurrentSegment(event: CustomEvent<SegmentChangeEventDetail>): void {
    this.currentSegment = event.detail.value as string;
  }

  private handleError(error: any): Observable<never> {
    return from(
      this.toastController
        .create({
          message:
            'Ocurrió un error al enviar tu reporte. Pero se guardo en tu dispositivo.',
          duration: 4000,
          position: 'bottom',
          animated: true,
        })
        .then((toast) => {
          toast.present();
        })
    ).pipe(switchMap(() => throwError(() => error)));
  }
}
