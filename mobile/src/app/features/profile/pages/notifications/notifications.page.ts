import { Component, effect, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonRippleEffect,
} from '@ionic/angular/standalone';
import { NotificationService } from '@core/services/notification.service';
import { AuthService } from '@core/services/auth.service';
import { ArrowLeft, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.css'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonRippleEffect,
    LucideAngularModule,
    CommonModule,
    RouterLink,
  ],
})
export class NotificationsPage implements OnInit {
  notificationService = inject(NotificationService);
  authService = inject(AuthService);
  backIcon = ArrowLeft;

  constructor() {
    effect(async () => {
      const userId = this.authService.user()?.id;

      if (userId) {
        await this.notificationService.startListening();
      }
    });
  }

  ngOnInit() {
    // console.log('abri el canal');
    // if (userId) {
    // }
  }
}
