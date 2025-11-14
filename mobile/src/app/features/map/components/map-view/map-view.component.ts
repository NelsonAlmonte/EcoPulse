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
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';

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
  @ViewChild('map') mapRef!: ElementRef<Element>;
  map!: google.maps.Map;
  markers: google.maps.marker.AdvancedMarkerElement[] = [];

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
      mapId: 'issues-maps',
      center: {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      },
      zoom: 10,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
      cameraControl: false,
    });

    this.map.addListener('idle', () => {
      const bounds = this.getBounds(this.map);

      if (!bounds) return;

      this.issueService.getIssuesByBounds(bounds);
    });

    this.addMarkers();
  }

  // async viewIssueDetail() {
  //   await this.map.setOnMarkerClickListener(async (marker) => {
  //     const issue = this.markerData.get(marker.markerId)!;
  //     const userId = this.authService.loggedUserData()!.id;
  //     const modal = await this.modalController.create({
  //       component: IssueDetailComponent,
  //       cssClass: 'issue-detail-modal',
  //       initialBreakpoint: 0.38,
  //       // breakpoints: [0, 0.47],
  //       componentProps: {
  //         issue: {},
  //       },
  //     });

  //     if (issue.comment) modal.initialBreakpoint = 0.45;

  //     modal.present();

  //     this.issueService.getIssue(issue.id, userId);
  //   });
  // }

  async addMarkers() {
    effect(
      async () => {
        const issues = this.issueService.issueList().data;

        if (!issues.length) return;

        if (this.markers.length > 0) {
          this.removeMarkers();
        }

        const { AdvancedMarkerElement } = await importLibrary('marker');

        for (const issue of issues) {
          const marker = new AdvancedMarkerElement({
            map: this.map,
            position: {
              lat: issue.latitude,
              lng: issue.longitude,
            },
            gmpClickable: true,
          });

          this.markers.push(marker);

          //TODO: Finish this
          marker.addEventListener('click', (e) => {
            console.log(e);
          });
        }
      },
      { injector: this.injector }
    );
  }

  getBounds(map: google.maps.Map): Bounds | undefined {
    const bounds = map.getBounds();

    if (!bounds) {
      //TODO: Handle error
      console.log('error');
      return;
    }

    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();

    return {
      north: ne.lat(),
      south: sw.lat(),
      east: ne.lng(),
      west: sw.lng(),
    };
  }

  removeMarkers(): void {
    for (const marker of this.markers) {
      marker.map = null;
    }
    this.markers = [];
  }
}
