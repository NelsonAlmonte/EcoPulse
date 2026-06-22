import { Component, OnInit } from '@angular/core';
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
  backIcon = ArrowLeft;

  ngOnInit() {}
}
