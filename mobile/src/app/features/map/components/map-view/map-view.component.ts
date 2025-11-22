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
  ViewChild,
} from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { Issue } from '@shared/models/issue.model';
import { ModalController, ToastController } from '@ionic/angular/standalone';
import { IssueDetailComponent } from '@features/report/components/issue-detail/issue-detail.component';
import { IssueMarkerComponent } from '@features/map/components/issue-marker/issue-marker.component';
import { IssueService } from '@core/services/issue.service';
import { AuthService } from '@core/services/auth.service';
import { importLibrary } from '@googlemaps/js-api-loader';
import { MapService } from '@core/services/map.service';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MapViewComponent implements AfterViewInit {
  injector = inject(Injector);
  environmentInjector = inject(EnvironmentInjector);
  mapService = inject(MapService);
  modalController = inject(ModalController);
  toastController = inject(ToastController);
  issueService = inject(IssueService);
  authService = inject(AuthService);
  renderer = inject(Renderer2);
  @ViewChild('map') mapRef!: ElementRef<Element>;
  map!: google.maps.Map;
  markers = new Map<google.maps.marker.AdvancedMarkerElement, Issue>();

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

    this.map.addListener('idle', async () => {
      await this.getBounds(this.map);
      const bounds = this.mapService.bounds();

      if (!bounds) return;

      this.issueService.getIssuesByBounds(bounds).subscribe({
        next: (response) => {
          this.issueService.issueList.update(() => response);
        },
        error: async (err) => {
          console.log(err);
          const toast = await this.toastController.create({
            message: 'Ocurrió un error al obtener los reportes.',
            duration: 4000,
            position: 'bottom',
          });

          toast.present();
        },
      });
    });

    this.addMarkers();
  }

  async addMarkers() {
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

          marker.addEventListener('click', async () => {
            await this.viewIssueDetail(this.markers.get(marker));
          });
        }
      },
      { injector: this.injector }
    );
  }

  async viewIssueDetail(issue?: Issue): Promise<void> {
    if (!issue) {
      const toast = await this.toastController.create({
        message:
          'Ocurrio un error al ver este reporte, intentelo de nuevo mas tarde.',
        duration: 4000,
        position: 'bottom',
        animated: true,
      });

      toast.present();
      return;
    }

    const previouslyFocused = document.activeElement as HTMLElement | null;

    const userId = this.authService.loggedUserData()!.id;
    const modal = await this.modalController.create({
      component: IssueDetailComponent,
      cssClass: 'issue-detail-modal',
      initialBreakpoint: 0.45,
      // breakpoints: [0, 0.47],
      componentProps: {
        issue: {},
      },
      backdropDismiss: true,
      focusTrap: false,
    });

    if (issue!.comment) modal.initialBreakpoint = 0.55;

    await modal.present();

    modal.onDidDismiss().then(() => this.issueService.issue.set(null));

    modal.onWillDismiss().then(() => {
      (document.activeElement as HTMLElement | null)?.blur();

      setTimeout(() => {
        if (
          previouslyFocused &&
          typeof previouslyFocused.focus === 'function'
        ) {
          previouslyFocused.focus();
        } else {
          document.body.focus();
        }
      }, 20);
    });

    this.issueService.getIssue(issue!.id, userId);
  }

  async getBounds(map: google.maps.Map): Promise<void> {
    const bounds = map.getBounds();

    if (!bounds) {
      const toast = await this.toastController.create({
        message:
          'Ocurrio un error al obtener los reportes, intentelo de nuevo mas tarde.',
        duration: 4000,
        position: 'bottom',
        animated: true,
      });

      toast.present();
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
}
