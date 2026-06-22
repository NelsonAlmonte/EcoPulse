import { Component, effect, inject, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Network } from '@capacitor/network';
import { UiService } from '@core/services/ui.service';
import { NotificationService } from '@core/services/notification.service';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  uiService = inject(UiService);
  notificationService = inject(NotificationService);
  authService = inject(AuthService);
  wasConnected: boolean | null = null;

  constructor() {
    effect(() => {
      const userId = this.authService.user()?.id;

      if (userId) {
        this.notificationService.startListening(userId);
      }
    });
  }

  async ngOnInit() {
    const initialStatus = await Network.getStatus();

    this.wasConnected = initialStatus.connected;
    this.uiService.hasConnection.set(initialStatus.connected);

    Network.addListener('networkStatusChange', async (status) => {
      if (this.wasConnected === status.connected) return;

      this.wasConnected = status.connected;
      this.uiService.hasConnection.set(status.connected);

      if (!status.connected) {
        await this.uiService.showToast('No tienes conexión a internet.');
      } else {
        await this.uiService.showToast('Se restableció la conexión.');
      }
    });
  }
}
