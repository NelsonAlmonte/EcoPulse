import { Component, inject, input } from '@angular/core';
import { IssueService } from '@core/services/issue.service';
import {
  ActionSheetController,
  LoadingController,
  ModalController,
  ToastController,
} from '@ionic/angular/standalone';
import { RelativeTimePipe } from '@shared/pipes/relative-time.pipe';
import { DEFAULT_STATUS, iconMap } from '@shared/constants/system.constant';
import { Issue } from '@shared/models/issue.model';
import { HighlightButtonComponent } from '@features/report/components/highlight-button/highlight-button.component';
import { IssuePhotoComponent } from '@features/report/components/issue-photo/issue-photo.component';
import { IssueDetailLoadingComponent } from '@shared/components/issue-detail-loading/issue-detail-loading.component';
import {
  CheckCircleIcon,
  CircleUserIcon,
  ClockIcon,
  EllipsisIcon,
  LucideAngularModule,
  LucideIconData,
  Maximize2Icon,
  TreePineIcon,
} from 'lucide-angular';
import type { OverlayEventDetail } from '@ionic/core';
import { UserService } from '@core/services/user.service';
import { AuthService } from '@core/services/auth.service';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-issue-detail',
  templateUrl: './issue-detail.component.html',
  styleUrls: ['./issue-detail.component.css'],
  imports: [
    LucideAngularModule,
    HighlightButtonComponent,
    IssueDetailLoadingComponent,
    RelativeTimePipe,
  ],
})
export class IssueDetailComponent {
  issueService = inject(IssueService);
  userService = inject(UserService);
  authService = inject(AuthService);
  modalController = inject(ModalController);
  actionSheetController = inject(ActionSheetController);
  toastController = inject(ToastController);
  loadingController = inject(LoadingController);
  issue = input.required<Issue | null>();
  DEFAULT_STATUS = DEFAULT_STATUS;
  checkCircle = CheckCircleIcon;
  clockIcon = ClockIcon;
  userIcon = CircleUserIcon;
  viewPhotoIcon = Maximize2Icon;
  optionsIcon = EllipsisIcon;
  actionSheetButtons = [
    {
      text: 'Ver imágen completa',
      data: {
        action: 'view',
      },
    },
    {
      text: 'Eliminar reporte',
      role: 'destructive',
      data: {
        action: 'delete',
      },
    },
    {
      text: 'Cerrar',
      role: 'cancel',
      data: {
        action: 'cancel',
      },
    },
  ];
  AMOUNT_OF_ISSUES = 3;

  get issueData() {
    return this.issue()?.id ? this.issue() : this.issueService.issue();
  }

  showIcon(iconName: string): LucideIconData {
    return iconMap[iconName] || TreePineIcon;
  }

  async openOptions(): Promise<void> {
    const actionSheet = await this.actionSheetController.create({
      header: 'Acciones',
      buttons: this.actionSheetButtons,
    });

    await actionSheet.present();

    actionSheet.addEventListener(
      'willDismiss',
      async (event: CustomEvent<OverlayEventDetail>) =>
        await this.handleOptions(event)
    );
  }

  async handleOptions(event: CustomEvent<OverlayEventDetail>) {
    const selectedOption = event.detail.data;

    if (!selectedOption) return;

    const selectedOptionAction = selectedOption.action;

    switch (selectedOptionAction) {
      case 'view':
        await this.viewPhoto(this.issueData!);
        break;

      case 'delete':
        await this.deleteIssue(this.issueData!.id);
        break;

      default:
        break;
    }
  }

  async deleteIssue(id: string) {
    const actionSheet = await this.actionSheetController.create({
      header: '¿Desea eliminar este reporte?',
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

        const loading = await this.loadingController.create({
          message: 'Eliminando este reporte...',
          cssClass: 'delete-loading',
        });

        await loading.present();

        this.issueService
          .deleteIssue(id)
          .pipe(
            tap(async () => {
              const toast = await this.toastController.create({
                message: 'Reporte eliminado exitosamente.',
                duration: 4000,
                position: 'bottom',
              });

              const modal = await this.modalController.getTop();

              await loading.dismiss();
              await toast.present();
              modal?.dismiss();

              this.issueService.issueList.update((current) => ({
                data: current.data.filter((issue) => issue.id !== id),
                pagination: current.pagination,
              }));
            }),
            switchMap(() =>
              this.userService.getUserIssues(
                this.authService.loggedUserData()!.id,
                this.AMOUNT_OF_ISSUES
              )
            )
          )
          .subscribe({
            next: (response) => this.userService.issueList.set(response),
            error: async (err) => {
              console.log(err);

              const toast = await this.toastController.create({
                message: 'Ocurrió un error al eliminar este reporte.',
                duration: 4000,
                position: 'bottom',
              });

              await toast.present();
            },
            complete: () => this.userService.isLoading.set(false),
          });
      }
    );

    await actionSheet.present();
  }

  async viewPhoto(issue: Issue): Promise<void> {
    const modal = await this.modalController.create({
      component: IssuePhotoComponent,
      cssClass: 'issue-photo-modal',
      componentProps: {
        photo: issue.photo,
      },
    });

    await modal.present();
  }
}
