import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  inject,
  ViewChild,
} from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { importLibrary } from '@googlemaps/js-api-loader';
import { MapService } from '@core/services/map.service';

@Component({
  selector: 'app-location-preview',
  templateUrl: './location-preview.component.html',
  styleUrls: ['./location-preview.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LocationPreviewComponent implements AfterViewInit {
  @ViewChild('map') mapRef!: ElementRef<Element>;
  mapService = inject(MapService);
  map!: google.maps.Map;

  async ngAfterViewInit() {
    await this.initMap();
  }

  async initMap() {
    const mapElement = this.mapRef.nativeElement as google.maps.MapElement;
    const position = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
    });
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
}
