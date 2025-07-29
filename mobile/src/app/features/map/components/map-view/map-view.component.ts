import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  ElementRef,
  inject,
  Injector,
  input,
  signal,
  ViewChild,
} from '@angular/core';
import { GoogleMap, Marker } from '@capacitor/google-maps';
import { Geolocation } from '@capacitor/geolocation';
import { environment } from 'src/environments/environment';
import { ApiResult } from '@core/interfaces/api.interface';
import { Issue } from '@shared/models/issue.model';
import { ModalController } from '@ionic/angular/standalone';
import { IssueDetailComponent } from '@features/report/components/issue-detail/issue-detail.component';
import { IssueService } from '@core/services/issue.service';
import { AuthService } from '@core/services/auth.service';

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
  issueService = inject(IssueService);
  authService = inject(AuthService);
  @ViewChild('map') mapRef!: ElementRef<HTMLElement>;
  map!: GoogleMap;
  markerIds: string[] = [];
  markerData = new Map<string, string>();

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
      const issueId = this.markerData.get(marker.markerId);
      const userId = this.authService.loggedUserData().id;
      const modal = await this.modalController.create({
        component: IssueDetailComponent,
        cssClass: 'issue-detail-modal',
        componentProps: {
          issue: {},
        },
      });

      modal.present();

      this.issueService.getIssue(issueId!, userId);
    });
  }

  async addMarkers() {
    effect(
      async () => {
        const issues = this.issues().data;

        if (!issues) return;

        if (this.markerIds.length > 0) {
          await this.map.removeMarkers(this.markerIds);
        }

        const markers: Marker[] = issues.map(({ latitude, longitude }) => ({
          coordinate: {
            lat: Number(latitude),
            lng: Number(longitude),
          },
        }));

        this.markerIds = await this.map.addMarkers(markers);

        this.markerIds.forEach((id, index) => {
          this.markerData.set(id, issues[index].id);
        });

        await this.map.enableClustering();
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
