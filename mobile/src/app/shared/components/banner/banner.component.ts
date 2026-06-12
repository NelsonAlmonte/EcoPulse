import { Component, input, OnInit } from '@angular/core';
import { IonRippleEffect } from '@ionic/angular/standalone';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css'],
  imports: [IonRippleEffect],
})
export class BannerComponent {
  title = input.required<string>();
  content = input.required<string>();
  isVisible = true;
  isClosing = false;

  hide(): void {
    this.isClosing = true;

    setTimeout(() => {
      this.isVisible = false;
    }, 300);
  }
}
