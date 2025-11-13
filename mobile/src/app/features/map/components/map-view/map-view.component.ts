import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  ElementRef,
  inject,
  Injector,
  ViewChild,
} from '@angular/core';
import { GoogleMap, LatLngBounds, Marker } from '@capacitor/google-maps';
import { Geolocation } from '@capacitor/geolocation';
import { environment } from 'src/environments/environment';
import { Issue } from '@shared/models/issue.model';
import { ModalController } from '@ionic/angular/standalone';
import { IssueDetailComponent } from '@features/report/components/issue-detail/issue-detail.component';
import { IssueService } from '@core/services/issue.service';
import { AuthService } from '@core/services/auth.service';
import { Bounds } from '@shared/models/user.model';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MapViewComponent implements AfterViewInit {
  injector = inject(Injector);
  modalController = inject(ModalController);
  issueService = inject(IssueService);
  authService = inject(AuthService);
  @ViewChild('map') mapRef!: ElementRef<HTMLElement>;
  map!: GoogleMap;
  markerIds: string[] = [];
  markerData = new Map<string, Issue>();

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
        zoom: 10,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
        cameraControl: false,
      },
    });

    this.map.setOnCameraIdleListener((ev) =>
      this.issueService.getIssuesByBounds(this.getBounds(ev.bounds))
    );

    await this.addMarkers();
    await this.viewIssueDetail();
  }

  async viewIssueDetail() {
    await this.map.setOnMarkerClickListener(async (marker) => {
      const issue = this.markerData.get(marker.markerId)!;
      const userId = this.authService.loggedUserData()!.id;
      const modal = await this.modalController.create({
        component: IssueDetailComponent,
        cssClass: 'issue-detail-modal',
        initialBreakpoint: 0.38,
        // breakpoints: [0, 0.47],
        componentProps: {
          issue: {},
        },
      });

      if (issue.comment) modal.initialBreakpoint = 0.45;

      modal.present();

      this.issueService.getIssue(issue.id, userId);
    });
  }

  async addMarkers() {
    effect(
      async () => {
        const issues = this.issueService.issueList();

        if (!issues.data.length) return;

        if (this.markerIds.length > 0) {
          await this.map.removeMarkers(this.markerIds);
        }

        const markers: Marker[] = issues.data.map(
          ({ latitude, longitude }) => ({
            coordinate: {
              lat: Number(latitude),
              lng: Number(longitude),
            },
          })
        );

        this.markerIds = await this.map.addMarkers(markers);

        this.markerIds.forEach((id, index) => {
          this.markerData.set(id, issues.data[index]!);
        });
      },
      { injector: this.injector }
    );
  }

  getBounds(bounds: LatLngBounds): Bounds {
    const ne = bounds.northeast;
    const sw = bounds.southwest;

    return {
      north: ne.lat,
      south: sw.lat,
      east: ne.lng,
      west: sw.lng,
    };
  }
}
