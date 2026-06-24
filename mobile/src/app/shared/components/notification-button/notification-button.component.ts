import { Component, inject, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NotificationService } from '@core/services/notification.service';
import { IonRippleEffect } from '@ionic/angular/standalone';
import { BellIcon, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-notification-button',
  templateUrl: './notification-button.component.html',
  styleUrls: ['./notification-button.component.css'],
  imports: [RouterModule, IonRippleEffect, LucideAngularModule],
})
export class NotificationButtonComponent {
  from = input.required<string>();
  notificationService = inject(NotificationService);
  notificationIcon = BellIcon;

  get hasNewNotification() {
    const hasNewNotification = localStorage.getItem('hasNewNotification');

    if (!hasNewNotification) return false;

    return true;
  }
}
