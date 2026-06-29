import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonRippleEffect,
  ActionSheetController,
} from '@ionic/angular/standalone';
import { OverlayEventDetail } from '@ionic/core';
import {
  CircleCheck,
  CircleDot,
  CircleEllipsis,
  CircleX,
  EllipsisIcon,
  LucideAngularModule,
} from 'lucide-angular';
import { UiService } from '@core/services/ui.service';
import { NotificationService } from '@core/services/notification.service';
import { RelativeTimePipe } from '@shared/pipes/relative-time.pipe';
import { UpdateNotificationDto } from '@shared/dto/notification.dto';
import { Notification } from '@shared/models/notification.model';
import { tap } from 'rxjs';

@Component({
  selector: 'app-notification-item',
  templateUrl: './notification-item.component.html',
  styleUrls: ['./notification-item.component.css'],
  imports: [IonRippleEffect, LucideAngularModule, RelativeTimePipe],
})
export class NotificationItemComponent {
  notification = input.required<Notification>();
  notificationService = inject(NotificationService);
  uiService = inject(UiService);
  actionSheetController = inject(ActionSheetController);
  router = inject(Router);
  optionsIcon = EllipsisIcon;
  statusMap = {
    PENDIENTE: {
      label: 'Pendiente',
      icon: CircleDot,
    },
    EN_PROCESO: {
      label: 'En proceso',
      icon: CircleEllipsis,
    },
    RESUELTO: {
      label: 'Resuelto',
      icon: CircleCheck,
    },
    DESCARTADO: {
      label: 'Descartado',
      icon: CircleX,
    },
  } as const;
  actionSheetButtons = [
    {
      text: 'Ver reporte en el mapa',
      data: {
        action: 'map',
      },
    },
    {
      text: `Eliminar notificación`,
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

  async openOptions(): Promise<void> {
    const buttons = [...this.actionSheetButtons];

    buttons.unshift({
      text: `Marcar notificación como ${
        this.notification().isRead ? 'no leída' : 'leída'
      }`,
      data: {
        action: 'toggle',
      },
    });

    const actionSheet = await this.actionSheetController.create({
      header: 'Acciones',
      cssClass: 'action-sheet',
      buttons,
    });

    await actionSheet.present();

    actionSheet.addEventListener(
      'willDismiss',
      async (event: CustomEvent<OverlayEventDetail>) =>
        await this.handleOptions(event)
    );
  }

  async handleOptions(event: CustomEvent<OverlayEventDetail>): Promise<void> {
    const selectedOption = event.detail.data;

    if (!selectedOption) return;

    const selectedOptionAction = selectedOption.action;

    switch (selectedOptionAction) {
      case 'toggle':
        this.toggleReadStatus(this.notification().id);
        break;

      case 'delete':
        await this.deleteNotification(this.notification().id);
        break;

      case 'map':
        this.viewIssueInMap();
        break;

      default:
        break;
    }
  }

  async deleteNotification(id: string): Promise<void> {
    const actionSheet = await this.actionSheetController.create({
      header: '¿Desea eliminar esta notificación?',
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

        await this.uiService.showLoading('Eliminando notificación...');

        this.notificationService
          .deleteNotification(id)
          .pipe(
            tap(async () => {
              await this.uiService.showToast(
                'Notificación eliminada exitosamente.'
              );

              await this.uiService.hideLoading();

              this.notificationService.notificationList.update((current) => ({
                data: current.data.filter(
                  (notification) => notification.id !== id
                ),
                pagination: current.pagination,
              }));
            })
          )
          .subscribe({
            error: async (err) => {
              console.log(err);
              await this.uiService.showToast(
                'Ocurrió un error al eliminar esta notificación.'
              );
            },
          });
      }
    );

    await actionSheet.present();
  }

  viewIssueInMap(): void {
    this.router.navigate(['/tabs/map'], {
      queryParams: {
        lat: this.notification().issue.latitude,
        lng: this.notification().issue.longitude,
      },
    });
  }

  toggleReadStatus(id: string) {
    const updateNotificationDto: UpdateNotificationDto = {
      isRead: !this.notification().isRead,
    };

    this.notificationService
      .toggleReadStatus(id, updateNotificationDto)
      .subscribe({
        next: () => {
          this.notification().isRead = updateNotificationDto.isRead;
        },
        error: async (err) => {
          console.log(err);
          await this.uiService.showToast(
            'Ocurrió un error al actualizar esta notificación.'
          );
        },
      });
  }
}
