import { Component, inject, input } from '@angular/core';
import { IssueCardComponent } from '@features/report/components/issue-card/issue-card.component';
import {
  IonRippleEffect,
  IonActionSheet,
  ActionSheetController,
  ModalController,
  ToastController,
  LoadingController,
} from '@ionic/angular/standalone';
import { EllipsisIcon, LucideAngularModule } from 'lucide-angular';
import { v4 as uuidv4 } from 'uuid';
import { Issue } from '@shared/models/issue.model';
import { OverlayEventDetail } from '@ionic/core';
import { IssueService } from '@core/services/issue.service';
import { UiService } from '@core/services/ui.service';
import { catchError, switchMap, tap, throwError } from 'rxjs';
import { OfflineService } from '@core/services/offline.service';
import { dataUrlToFile } from '@shared/utils/file.util';
import { UserService } from '@core/services/user.service';
import { CreateIssueDto } from '@shared/dto/issue.dto';
import { DEFAULT_STATUS } from '@shared/constants/system.constant';

@Component({
  selector: 'app-offline-issue-detail',
  templateUrl: './offline-issue-detail.component.html',
  styleUrls: ['./offline-issue-detail.component.css'],
  imports: [
    IssueCardComponent,
    IonRippleEffect,
    LucideAngularModule,
    IonActionSheet,
  ],
})
export class OfflineIssueDetailComponent {
  issue = input.required<Issue>();
  offlineService = inject(OfflineService);
  issueService = inject(IssueService);
  userService = inject(UserService);
  uiService = inject(UiService);
  modalController = inject(ModalController);
  actionSheetController = inject(ActionSheetController);
  toastController = inject(ToastController);
  loadingController = inject(LoadingController);
  actionSheetButtons = [
    {
      text: 'Enviar reporte',
      data: {
        action: 'send',
      },
    },
    {
      text: 'Eliminar reporte',
      data: {
        action: 'delete',
      },
    },
    {
      text: 'Cerrar',
      data: {
        action: 'cancel',
      },
    },
  ];
  optionsIcon = EllipsisIcon;

  async handleOptions(event: CustomEvent<OverlayEventDetail>): Promise<void> {
    const selectedOption = event.detail.data;

    if (!selectedOption) return;

    const selectedOptionAction = selectedOption.action;

    switch (selectedOptionAction) {
      case 'send':
        await this.sendIssue(this.issue());
        break;

      case 'delete':
        await this.deleteIssue(this.issue().id);
        break;

      default:
        break;
    }
  }

  async sendIssue(issue: Issue): Promise<void> {
    await this.uiService.showLoading('Enviando reporte...');

    const formData = new FormData();

    formData.append(
      'photo',
      dataUrlToFile(issue.photo.toString(), `issue-${uuidv4()}.jpg`)
    );

    const issueToSend: CreateIssueDto = {
      photo: issue.photo,
      status: DEFAULT_STATUS,
      latitude: issue.latitude,
      longitude: issue.longitude,
      comment: issue.comment,
      category: issue.categoryId,
      user: issue.userId,
      createdAt: issue.createdAt,
    };

    this.issueService
      .uploadPhoto(formData)
      .pipe(
        switchMap((response) => {
          issueToSend.photo = `${response.fullPath}`;

          return this.issueService.createIssue(issueToSend);
        }),
        catchError((err) => {
          return throwError(() => err);
        })
      )
      .subscribe({
        error: async (err) => {
          console.log(err);
          await this.uiService.hideLoading();
          await this.uiService.showToast(
            'Ocurrió un error al enviar tu reporte.'
          );
        },
        complete: async () => {
          await this.uiService.hideLoading();
          this.offlineService.removeOfflineIssue(issue.id);
          await this.uiService.showToast(
            'Tu reporte se ha enviado correctamente.'
          );
        },
      });
  }

  async deleteIssue(id: string): Promise<void> {
    const actionSheet = await this.actionSheetController.create({
      header: '¿Desea eliminar este reporte?',
      cssClass: 'action-sheet',
      buttons: [
        {
          text: 'Sí, eliminar',
          role: 'destructive',
          data: {
            action: 'delete',
          },
        },
        {
          text: 'No, cancelar',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ],
    });

    actionSheet.addEventListener(
      'didDismiss',
      async (event: CustomEvent<OverlayEventDetail>) => {
        const selectedOption = event.detail.data.action;

        if (selectedOption !== 'delete') return;

        await this.uiService.showLoading('Eliminando reporte...');

        this.offlineService.removeOfflineIssue(id);

        await this.uiService.showToast('Reporte eliminado exitosamente.');
        await this.uiService.hideLoading();
      }
    );

    await actionSheet.present();
  }
}
