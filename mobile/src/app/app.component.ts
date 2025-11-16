import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {
    const head = document.head;
    const originalInsertBefore = head.insertBefore;

    head.insertBefore = function <T extends Node>(
      newElement: T,
      referenceElement: Node | null
    ): T {
      if (
        newElement instanceof Element &&
        newElement.hasAttribute('href') &&
        newElement.getAttribute('href')?.includes('fonts.googleapis')
      ) {
        return newElement;
      }

      return originalInsertBefore.call(this, newElement, referenceElement) as T;
    };
  }
}
