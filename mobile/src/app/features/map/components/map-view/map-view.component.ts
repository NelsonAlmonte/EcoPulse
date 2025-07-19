import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  ElementRef,
  inject,
  Injector,
  input,
  ViewChild,
} from '@angular/core';
import { GoogleMap, Marker } from '@capacitor/google-maps';
import { Geolocation } from '@capacitor/geolocation';
import { environment } from 'src/environments/environment';
import { ApiResult } from '@core/interfaces/api.interface';
import { Issue } from '@shared/models/issue.model';
import { ModalController } from '@ionic/angular/standalone';
import { IssueDetailComponent } from '@features/report/components/issue-detail/issue-detail.component';

interface UnsafeCluster {
  latitude: number | (() => number);
  longitude: number | (() => number);
}
@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MapViewComponent implements AfterViewInit {
  issues = input.required<ApiResult<Issue[]>>();
  injector = inject(Injector);
  modalController = inject(ModalController);
  @ViewChild('map') mapRef!: ElementRef<HTMLElement>;
  map!: GoogleMap;
  markerIds: string[] = [];

  constructor() {}

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
        zoom: 14,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
        cameraControl: false,
      },
    });

    await this.addMarkers();
    await this.zoomOnCluster();
    await this.viewIssueDetail();
  }

  async viewIssueDetail() {
    await this.map.setOnMarkerClickListener(async (marker) => {
      const modal = await this.modalController.create({
        component: IssueDetailComponent,
        // cssClass: [
        //   'rounded-2xl',
        //   'w-full',
        //   // 'max-w-[400px]',
        //   'h-auto',
        //   'max-h-1/2',
        //   'shadow-lg',
        //   // 'left-1/2',
        //   // '-translate-x-1/2',
        //   // 'translate-y-1/2',
        // ],
        // backdropDismiss: true,
        componentProps: {
          latitude: marker.latitude,
          longitude: marker.longitude,
        },
      });

      modal.present();
    });
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
                lat: Number(issue.latitude),
                lng: Number(issue.longitude),
              },
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
        zoom: 18,
        animationDuration: 500,
      });
    });
  }
}
