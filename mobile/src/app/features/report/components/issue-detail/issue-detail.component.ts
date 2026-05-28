import { Component, inject, input } from '@angular/core';
import { IssueService } from '@core/services/issue.service';
import {
  ActionSheetController,
  IonRippleEffect,
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
import { DomSanitizer } from '@angular/platform-browser';
import { UiService } from '@core/services/ui.service';

@Component({
  selector: 'app-issue-detail',
  templateUrl: './issue-detail.component.html',
  styleUrls: ['./issue-detail.component.css'],
  imports: [
    IonRippleEffect,
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
  uiService = inject(UiService);
  modalController = inject(ModalController);
  actionSheetController = inject(ActionSheetController);
  toastController = inject(ToastController);
  loadingController = inject(LoadingController);
  sanitizer = inject(DomSanitizer);
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

  private _hasIssueOwnership(): boolean {
    const userData = this.authService.loggedUserData();

    if (!userData) {
      this.authService.logout();
      return false;
    }

    return userData!.id === this.issueData!.user.id;
  }

  async openOptions(): Promise<void> {
    const buttons = [...this.actionSheetButtons];

    if (this._hasIssueOwnership()) {
      buttons.unshift({
        text: 'Eliminar reporte',
        role: 'destructive',
        data: {
          action: 'delete',
        },
      });
    }

    const actionSheet = await this.actionSheetController.create({
      header: 'Acciones',
      cssClass: 'action-sheet',
      buttons,
    });

    await actionSheet.present();

    actionSheet.addEventListener(
      'willDismiss',
      async (event: CustomEvent<OverlayEventDetail>) =>
        await this.handleOptions(event),
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

        await this.uiService.showLoading('Eliminando reporte...');

        this.issueService
          .deleteIssue(id)
          .pipe(
            tap(async () => {
              await this.uiService.showToast('Reporte eliminado exitosamente.');

              const modal = await this.modalController.getTop();

              await this.uiService.hideLoading();

              modal?.dismiss();

              this.issueService.issueList.update((current) => ({
                data: current.data.filter((issue) => issue.id !== id),
                pagination: current.pagination,
              }));
            }),
            switchMap(() =>
              this.userService.getUserIssues(
                this.authService.loggedUserData()!.id,
                this.AMOUNT_OF_ISSUES,
              ),
            ),
          )
          .subscribe({
            next: (response) => {
              this.userService.issueList.set(response);
              this.userService.counters.update((current) => ({
                ...current,
                issues: current.issues - 1,
              }));
            },
            error: async (err) => {
              console.log(err);
              await this.uiService.showToast(
                'Ocurrió un error al eliminar este reporte.',
              );
            },
            complete: () => this.userService.isLoading.set(false),
          });
      },
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
