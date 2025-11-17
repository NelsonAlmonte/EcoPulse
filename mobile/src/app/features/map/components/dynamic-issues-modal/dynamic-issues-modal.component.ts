import { Component } from '@angular/core';
import {
  IonAvatar,
  IonContent,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonSearchbar,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-dynamic-issues-modal',
  templateUrl: './dynamic-issues-modal.component.html',
  styleUrls: ['./dynamic-issues-modal.component.css'],
  imports: [
    IonAvatar,
    IonContent,
    IonImg,
    IonItem,
    IonLabel,
    IonList,
    IonModal,
    IonSearchbar,
  ],
})
export class DynamicIssuesModalComponent {
  count = 0;

  increment() {
    this.count++;
  }

  decrement() {
    this.count--;
  }
}
