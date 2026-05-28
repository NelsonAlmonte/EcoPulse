import {
  AfterViewInit,
  Component,
  createComponent,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  ElementRef,
  EnvironmentInjector,
  inject,
  Injector,
  Renderer2,
  signal,
  ViewChild,
} from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { Issue } from '@shared/models/issue.model';
import {
  IonProgressBar,
  ModalController,
  ToastController,
} from '@ionic/angular/standalone';
import { IssueDetailComponent } from '@features/report/components/issue-detail/issue-detail.component';
import { IssueMarkerComponent } from '@features/map/components/issue-marker/issue-marker.component';
import { IssueService } from '@core/services/issue.service';
import { AuthService } from '@core/services/auth.service';
import { importLibrary } from '@googlemaps/js-api-loader';
import { MapService } from '@core/services/map.service';
import { UiService } from '@core/services/ui.service';
import { Bounds } from '@shared/models/user.model';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonProgressBar],
})
export class MapViewComponent implements AfterViewInit {
  injector = inject(Injector);
  environmentInjector = inject(EnvironmentInjector);
  mapService = inject(MapService);
  modalController = inject(ModalController);
  toastController = inject(ToastController);
  issueService = inject(IssueService);
  authService = inject(AuthService);
  uiService = inject(UiService);
  renderer = inject(Renderer2);
  @ViewChild('map') mapRef!: ElementRef<Element>;
  map!: google.maps.Map;
  markers = new Map<google.maps.marker.AdvancedMarkerElement, Issue>();
  isLoading = signal(false);

  constructor() {
    effect(() => {
      this.issueService.order();

      const bounds = this.mapService.bounds();

      if (!bounds) return;

      this.fetchIssues(bounds);
    });
  }

  async ngAfterViewInit() {
    await this.initMap();
  }

  async initMap() {
    const mapElement = this.mapRef.nativeElement as google.maps.MapElement;
    const position = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
    });
    const options = {
      mapId: 'explore-map',
      center: {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      },
      zoom: 10,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
      cameraControl: false,
      clickableIcons: false,
    } as google.maps.MapOptions;

    this.map = await this.mapService.createMap(mapElement, options);

    this.map.addListener('bounds_changed', () => this.isLoading.set(true));

    this.map.addListener('idle', async () => {
      await this.getBounds(this.map);
    });

    this.addMarkers();
  }

  fetchIssues(bounds: Bounds): void {
    if (!bounds) return;

    this.issueService.isLoading.set(true);
    this.isLoading.set(true);

    this.issueService.getIssuesByBounds(bounds).subscribe({
      next: (response) => {
        this.issueService.issueList.set(response);
      },
      error: async (err) => {
        await this.uiService.showToast(
          'Ocurrió un error al obtener los reportes.',
        );
      },
      complete: () => {
        this.issueService.isLoading.set(false);
        this.isLoading.set(false);
      },
    });
  }

  async addMarkers(): Promise<void> {
    effect(
      async () => {
        const issues = this.issueService.issueList().data;

        if (!issues.length) return;

        if (this.markers.size > 0) {
          this.removeMarkers();
        }

        const { AdvancedMarkerElement } = await importLibrary('marker');

        for (const issue of issues) {
          const container = this.renderer.createElement('div');
          const component = createComponent(IssueMarkerComponent, {
            hostElement: container,
            environmentInjector: this.environmentInjector,
          });

          component.setInput('issue', issue);
          component.changeDetectorRef.detectChanges();

          const marker = new AdvancedMarkerElement({
            map: this.map,
            position: {
              lat: issue.latitude,
              lng: issue.longitude,
            },
            gmpClickable: true,
            content: container,
          });

          this.markers.set(marker, issue);

          marker.addEventListener('gmp-click', async () => {
            await this.viewIssueDetail(this.markers.get(marker));
          });
        }
      },
      { injector: this.injector },
    );
  }

  async viewIssueDetail(issue?: Issue): Promise<void> {
    if (!issue) {
      await this.uiService.showToast(
        'Ocurrio un error al ver este reporte, intentelo de nuevo mas tarde.',
      );
      return;
    }

    const userId = this.authService.loggedUserData()!.id;
    const modal = await this.modalController.create({
      component: IssueDetailComponent,
      cssClass: 'issue-detail-modal',
      initialBreakpoint: this.getBreakpoint(issue?.comment),
      componentProps: {
        issue: {},
      },
      backdropDismiss: true,
      focusTrap: false,
    });

    await modal.present();

    modal.onDidDismiss().then(() => this.issueService.issue.set(null));

    this.issueService.getIssue(issue!.id, userId).subscribe({
      next: (response) => {
        this.issueService.issue.set(response);
      },
      error: async (err) => {
        console.log(err);
        await this.uiService.showToast('Ocurrio un error al ver este reporte.');
      },
    });
  }

  async getBounds(map: google.maps.Map): Promise<void> {
    const bounds = map.getBounds();

    if (!bounds) {
      await this.uiService.showToast(
        'Ocurrio un error al ver este reporte, intentelo de nuevo mas tarde.',
      );
      return;
    }

    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();

    this.mapService.bounds.update(() => ({
      north: ne.lat(),
      south: sw.lat(),
      east: ne.lng(),
      west: sw.lng(),
    }));
  }

  removeMarkers(): void {
    for (const marker of this.markers.keys()) {
      marker.map = null;
    }
    this.markers.clear();
  }

  private getBreakpoint(comment?: string): number {
    const BASE = 0.41;

    if (!comment) return BASE;

    const screenWidth = window.innerWidth;
    const usableWidth = screenWidth - 64;
    const avgCharWidth = 8;
    const charsPerLine = Math.floor(usableWidth / avgCharWidth);
    const lines = Math.ceil(comment.length / charsPerLine);

    return Math.min(BASE + lines * 0.04, 0.75);
  }
}
