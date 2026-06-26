import { Component, input, OnInit } from '@angular/core';
import { Notification } from '@shared/models/notification.model';
import { IonRippleEffect } from '@ionic/angular/standalone';
import {
  Circle,
  CircleCheck,
  CircleDot,
  CircleX,
  EllipsisIcon,
  LucideAngularModule,
} from 'lucide-angular';
import { RelativeTimePipe } from '@shared/pipes/relative-time.pipe';

@Component({
  selector: 'app-notification-item',
  templateUrl: './notification-item.component.html',
  styleUrls: ['./notification-item.component.css'],
  imports: [IonRippleEffect, LucideAngularModule, RelativeTimePipe],
})
export class NotificationItemComponent implements OnInit {
  notification = input.required<Notification>();
  optionsIcon = EllipsisIcon;
  statusMap = {
    PENDIENTE: {
      label: 'Pendiente',
      icon: CircleDot,
    },
    RESUELTO: {
      label: 'Resuelto',
      icon: CircleCheck,
    },
    DESCARTADO: {
      label: 'Descartado',
      icon: CircleX,
    },
    EN_PROCESO: {
      label: 'En proceso',
      icon: Circle,
    },
    TODO: {
      label: 'En proceso',
      icon: Circle,
    },
  } as const;

  constructor() {}

  ngOnInit() {}
}
