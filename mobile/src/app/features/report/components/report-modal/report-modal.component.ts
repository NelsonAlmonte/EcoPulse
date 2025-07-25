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
} from '@ionic/angular/standalone';
import { switchMap } from 'rxjs';
import { Geolocation } from '@capacitor/geolocation';
import { IssueService } from '@core/services/issue.service';
import { AuthService } from '@core/services/auth.service';
import { CategoryListComponent } from '@features/report/components/category-list/category-list.component';
import { LocationPreviewComponent } from '@features/report/components/location-preview/location-preview.component';
import { CreateIssueDto } from '@shared/dto/issue.dto';
import { DEFAULT_STATUS } from '@shared/constants/system.constant';
import { v4 as uuidv4 } from 'uuid';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BanIcon,
  LucideAngularModule,
  SendIcon,
} from 'lucide-angular';

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
  modalController = inject(ModalController);
  photo = input.required<string>();
  comment: string = '';
  selectedCategory: string = '';
  currentSegment: string = 'photo';
  segments: string[] = ['photo', 'location', 'categories'];
  nextIcon = ArrowRightIcon;
  prevIcon = ArrowLeftIcon;
  sendIcon = SendIcon;
  cancelIcon = BanIcon;

  cancel(): Promise<boolean> {
    return this.modalController.dismiss(null, 'cancel');
  }

  async sendReport(): Promise<void> {
    const coordinates = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
    });
    const issue: CreateIssueDto = {
      photo: '',
      status: DEFAULT_STATUS,
      latitude: coordinates.coords.latitude.toString(),
      longitude: coordinates.coords.longitude.toString(),
      comment: this.comment,
      category: this.selectedCategory,
      user: this.authService.loggedUserData().id,
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

        //TODO: Update user issues
        this.issueService.issues.update((current) => ({
          ...current,
          data: [...(current.data ?? []), result.data!],
        }));
      });
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
}
