import { Injectable, signal } from '@angular/core';
import {
  Geolocation,
  PermissionStatus,
  Position,
} from '@capacitor/geolocation';
import {
  NativeSettings,
  AndroidSettings,
  IOSSettings,
} from 'capacitor-native-settings';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  hasLocationPermission = signal(false);

  async initialize(): Promise<void> {
    await this.checkPermission();
  }

  async checkPermission(): Promise<boolean> {
    try {
      const permissions: PermissionStatus =
        await Geolocation.checkPermissions();

      const granted = permissions.location === 'granted';

      this.hasLocationPermission.set(granted);

      return granted;
    } catch {
      this.hasLocationPermission.set(false);

      return false;
    }
  }

  async requestPermission(): Promise<boolean> {
    try {
      const permissions: PermissionStatus =
        await Geolocation.requestPermissions();

      const granted = permissions.location === 'granted';

      this.hasLocationPermission.set(granted);

      return granted;
    } catch {
      this.hasLocationPermission.set(false);

      return false;
    }
  }

  async getCurrentPosition(): Promise<Position | null> {
    try {
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
      });

      return position;
    } catch {
      return null;
    }
  }

  async openAppSettings(): Promise<boolean> {
    try {
      await NativeSettings.open({
        optionAndroid: AndroidSettings.ApplicationDetails,
        optionIOS: IOSSettings.App,
      });

      return true;
    } catch {
      return false;
    }
  }
}
