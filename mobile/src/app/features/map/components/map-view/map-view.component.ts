import {
  AfterViewInit,
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  ElementRef,
  inject,
  Injector,
  input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { GoogleMap, Marker } from '@capacitor/google-maps';
import { Geolocation } from '@capacitor/geolocation';
import { environment } from 'src/environments/environment';
import { ApiResult } from '@core/interfaces/api.interface';
import { Issue } from '@shared/models/issue.model';

interface MarkerCallbackData {
  markerId: string;
  latitude: number;
  longitude: number;
  title: string;
  snippet: string;
}

interface ClusterClickCallbackData {
  mapId: string;
  latitude: number;
  longitude: number;
  size: number;
  items: MarkerCallbackData[];
}

interface UnsafeCluster {
  latitude: number | (() => number);
  longitude: number | (() => number);
}
@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MapViewComponent implements OnInit, AfterViewInit {
  @ViewChild('map') mapRef!: ElementRef<HTMLElement>;
  issues = input.required<ApiResult<Issue[]>>();
  map!: GoogleMap;
  markerIds: string[] = [];
  injector = inject(Injector);
  mapZoom: number = 14;

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
      id: 'my-cool-map',
      element: this.mapRef.nativeElement,
      apiKey: environment.googleMapsApiKey,
      config: {
        center: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
        zoom: this.mapZoom,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
        cameraControl: false,
      },
    });

    await this.addMarkers();
    await this.map.enableClustering();
    await this.zoomOnCluster();
  }

  async addMarkers() {
    effect(
      async () => {
        if (this.issues().data) {
          if (this.markerIds.length > 0)
            await this.map.removeMarkers(this.markerIds);

          const markers: Marker[] = this.issues().data!.map((issue) => {
            return {
              coordinate: {
                lat: Number(issue.coordinates.split(',')[0]),
                lng: Number(issue.coordinates.split(',')[1]),
              },
              title: issue.categoryId,
            };
          });

          this.markerIds = await this.map.addMarkers(markers);
          await this.map.enableClustering();
        }
      },
      { injector: this.injector }
    );
  }

  async zoomOnCluster() {
    await this.map.setOnClusterClickListener(async (cluster) => {
      const { latitude, longitude } = cluster as UnsafeCluster;
      const lat = typeof latitude === 'function' ? latitude() : latitude;
      const lng = typeof longitude === 'function' ? longitude() : longitude;

      await this.map.setCamera({
        coordinate: {
          lat: lat,
          lng: lng,
        },
        zoom: this.mapZoom + 2,
        animate: true,
        animationDuration: 2000,
      });

      this.mapZoom += 2;
    });
  }
}
