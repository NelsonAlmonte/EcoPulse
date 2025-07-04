import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { GoogleMap } from '@capacitor/google-maps';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MapViewComponent implements OnInit {
  @ViewChild('map')
  mapRef!: ElementRef<HTMLElement>;
  map!: GoogleMap;

  constructor() {}

  ngOnInit() {}

  async initMap() {
    this.map = await GoogleMap.create({
      id: 'my-cool-map',
      element: this.mapRef.nativeElement,
      apiKey: environment.googleMapsApiKey,
      config: {
        center: {
          lat: 33.6,
          lng: -117.9,
        },
        zoom: 8,
      },
    });
  }
}
