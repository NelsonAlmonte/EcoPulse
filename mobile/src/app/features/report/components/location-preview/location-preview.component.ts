import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { GoogleMap, Marker } from '@capacitor/google-maps';
import { Geolocation } from '@capacitor/geolocation';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-location-preview',
  templateUrl: './location-preview.component.html',
  styleUrls: ['./location-preview.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LocationPreviewComponent implements OnInit, AfterViewInit {
  @ViewChild('map') mapRef!: ElementRef<HTMLElement>;
  map!: GoogleMap;

  constructor() {}

  ngOnInit() {}

  async ngAfterViewInit() {
    await this.initMap();
  }

  async initMap() {
    const position = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
    });

    this.map = await GoogleMap.create({
      id: 'location-preview-map',
      element: this.mapRef.nativeElement,
      apiKey: environment.googleMapsApiKey,
      config: {
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
      },
    });

    const marker: Marker = {
      coordinate: {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      },
    };

    await this.map.addMarker(marker);
  }
}
