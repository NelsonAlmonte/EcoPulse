import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { IonRippleEffect } from '@ionic/angular/standalone';
import { importLibrary } from '@googlemaps/js-api-loader';
import { MapService } from '@core/services/map.service';
import { UiService } from '@core/services/ui.service';
import { LucideAngularModule, MapPinOff } from 'lucide-angular';
import { AlertComponent } from '@shared/components/alert/alert.component';
import { LocationService } from '@core/services/location.service';
import {
  NativeSettings,
  AndroidSettings,
  IOSSettings,
} from 'capacitor-native-settings';

@Component({
  selector: 'app-location-preview',
  templateUrl: './location-preview.component.html',
  styleUrls: ['./location-preview.component.css'],
  imports: [IonRippleEffect, LucideAngularModule, AlertComponent],
})
export class LocationPreviewComponent implements AfterViewInit, OnInit {
  @ViewChild('map') mapRef!: ElementRef<Element>;
  mapService = inject(MapService);
  uiService = inject(UiService);
  locationService = inject(LocationService);
  map!: google.maps.Map;
  emptyIcon = MapPinOff;

  async ngOnInit(): Promise<void> {
    await this.locationService.initialize();
  }

  async ngAfterViewInit(): Promise<void> {
    if (!this.uiService.hasConnection()) return;

    await this.initMap();
  }

  async initMap(): Promise<void> {
    const mapElement = this.mapRef.nativeElement as google.maps.MapElement;
    const position = await this.locationService.getCurrentPosition();

    if (!position) {
      await this.uiService.showToast('No se pudo obtener tu ubicación.');

      return;
    }

    const options = {
      mapId: 'location-preview-map',
      center: {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      },
      zoom: 17,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
      cameraControl: false,
      clickableIcons: false,
      disableDefaultUI: true,
      disableDoubleClickZoom: true,
      scrollwheel: false,
      gestureHandling: 'none',
    } as google.maps.MapOptions;

    this.map = await this.mapService.createMap(mapElement, options);

    const { AdvancedMarkerElement } = await importLibrary('marker');

    new AdvancedMarkerElement({
      map: this.map,
      position: {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      },
    });
  }

  async gotoSettings(): Promise<void> {
    const opened = await this.locationService.openAppSettings();

    if (!opened) {
      await this.uiService.showToast(
        'Ocurrió un error al abrir la configuración.'
      );
    }
  }
}
