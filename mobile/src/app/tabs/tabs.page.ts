import {
  Component,
  EnvironmentInjector,
  inject,
  ViewChild,
} from '@angular/core';
import { OfflineService } from '@core/services/offline.service';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonBadge,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  mapOutline,
  cameraOutline,
  personOutline,
  map,
  camera,
  person,
} from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.css'],
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonBadge],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);
  offlineService = inject(OfflineService);
  @ViewChild('tabs') tabs!: IonTabs;
  selectedTab: string | undefined = 'map';

  constructor() {
    addIcons({ mapOutline, cameraOutline, personOutline, map, camera, person });
  }

  getSelectedTab() {
    this.selectedTab = this.tabs.getSelected();
  }
}
