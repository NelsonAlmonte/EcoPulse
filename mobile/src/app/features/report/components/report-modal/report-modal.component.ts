import { Component, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonFooter,
  IonHeader,
  IonLabel,
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
import { from, Observable, switchMap, throwError } from 'rxjs';
import { Geolocation } from '@capacitor/geolocation';
import { IssueService } from '@core/services/issue.service';
import { AuthService } from '@core/services/auth.service';
import { CategoryListComponent } from '@features/report/components/category-list/category-list.component';
import { LocationPreviewComponent } from '@features/report/components/location-preview/location-preview.component';
import { CreateIssueDto } from '@shared/dto/issue.dto';
import { DEFAULT_STATUS } from '@shared/constants/system.constant';
import { v4 as uuidv4 } from 'uuid';
import {
  AlertTriangleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  BanIcon,
  ImageIcon,
  LucideAngularModule,
  MapPinIcon,
  SendIcon,
} from 'lucide-angular';
import { UserService } from '@core/services/user.service';
import { ApiResult } from '@core/interfaces/api.interface';
import { Issue } from '@shared/models/issue.model';

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
  modalController = inject(ModalController);
  toastController = inject(ToastController);
  photo = input.required<string>();
  comment: string = '';
  selectedCategory: string = '';
  currentSegment: string = 'photo';
  segments: string[] = ['photo', 'location', 'categories'];
  nextIcon = ArrowRightIcon;
  prevIcon = ArrowLeftIcon;
  sendIcon = SendIcon;
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
  currentStatus: string = 'default';

  get buttonStatus() {
    return this.buttonOptions[
      this.currentStatus as keyof typeof this.buttonOptions
    ];
  }

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

  async sendReport(): Promise<void> {
    this.currentStatus = 'loading';

    const coordinates = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
    });
    const { latitude, longitude } =
      this.getRandomCoordinatesInDominicanRepublic();
    const issue: CreateIssueDto = {
      photo: '',
      status: DEFAULT_STATUS,
      latitude: latitude,
      longitude: longitude,
      // latitude: coordinates.coords.latitude,
      // longitude: coordinates.coords.longitude,
      comment: this.comment,
      category: this.selectedCategory,
      user: this.authService.loggedUserData()!.id,
    };
    const formData = new FormData();
    const toast = await this.toastController.create({
      message: 'Tu reporte se ha enviado correctamente.',
      duration: 4000,
      position: 'bottom',
      animated: true,
    });

    formData.append(
      'photo',
      this.dataUrlToFile(this.photo.toString(), `issue-${uuidv4()}.jpg`)
    );

    this.issueService
      .uploadPhoto(formData)
      .pipe(
        switchMap((result) => {
          if (result.error) return this.handleError(result.error);

          issue.photo = `${result.data.items!.fullPath}`;

          return this.issueService.createIssue(issue);
        })
      )
      .subscribe((result) => {
        if (result.error) {
          from(this.handleError(result.error))
            .pipe(switchMap(() => throwError(() => result.error)))
            .subscribe();
          return;
        }

        this.modalController.dismiss(result.data, 'confirm');

        this.userService.issues.update((current) =>
          this.updateUserIssues(current, result)
        );

        this.issueService.issues.update((current) => ({
          ...current,
          data: { items: [...(current.data.items ?? []), result.data.items!] },
        }));

        this.currentStatus = 'default';
        toast.present();
      });
  }

  updateUserIssues(
    currentData: ApiResult<Issue[]>,
    apiResult: ApiResult<Issue>
  ): ApiResult<Issue[]> {
    const updatedData = [
      apiResult.data.items!,
      ...(currentData.data.items!.length >= 3
        ? currentData.data.items!.slice(0, -1) ?? []
        : currentData.data.items!),
    ];

    return {
      ...currentData,
      data: { items: updatedData },
    };
  }

  dataUrlToFile(input: string, filename: string): File {
    const match = input.match(/\[Input Signal:\s*(.*?)\s*\]/);

    if (!match || !match[1]) {
      throw new Error(
        'Base64 inválido o no encontrado en el formato esperado.'
      );
    }

    const dataUrl = match[1];
    const [metadata, base64] = dataUrl.split(',');
    const mime = metadata.match(/:(.*?);/)![1];
    const binary = atob(base64);
    const array = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
      array[i] = binary.charCodeAt(i);
    }

    return new File([array], filename, { type: mime });
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
          message: 'Ocurrió un error al enviar tu reporte.',
          duration: 4000,
          position: 'bottom',
          animated: true,
          buttons: [
            {
              text: 'Reintentar',
              side: 'end',
              handler: () => {
                this.sendReport();
                return false;
              },
            },
          ],
        })
        .then((toast) => toast.present())
    ).pipe(switchMap(() => throwError(() => error)));
  }
}
