import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { environment } from 'src/environments/environment';
import { importLibrary, setOptions } from '@googlemaps/js-api-loader';

@Component({
  selector: 'app-location-preview',
  templateUrl: './location-preview.component.html',
  styleUrls: ['./location-preview.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LocationPreviewComponent implements AfterViewInit {
  @ViewChild('map') mapRef!: ElementRef<Element>;
  map!: google.maps.Map;

  async ngAfterViewInit() {
    await this.initMap();
  }

  async initMap() {
    setOptions({ key: environment.googleMapsApiKey });

    const { Map } = await importLibrary('maps');
    const mapElement = this.mapRef.nativeElement as google.maps.MapElement;
    const position = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
    });

    this.map = new Map(mapElement, {
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
    });

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
