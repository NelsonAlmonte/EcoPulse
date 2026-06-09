import { inject, Injectable, signal } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  toastController = inject(ToastController);
  loadingController = inject(LoadingController);
  hasConnection = signal<boolean | null>(null);
  loading?: HTMLIonLoadingElement;

  async showLoading(
    message = 'Cargando...',
    cssClass = 'loading'
  ): Promise<void> {
    if (this.loading) return;

    this.loading = await this.loadingController.create({
      message,
      cssClass,
    });

    await this.loading.present();
  }

  async hideLoading(): Promise<void> {
    if (!this.loading) return;

    await this.loading.dismiss();

    this.loading = undefined;
  }

  async showToast(message: string, color?: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 4000,
      position: 'bottom',
      animated: true,
      color,
    });

    await toast.present();
  }
}
