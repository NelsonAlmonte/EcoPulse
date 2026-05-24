import {
  Component,
  EnvironmentInjector,
  inject,
  ViewChild,
} from '@angular/core';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
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
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);
  @ViewChild('tabs') tabs!: IonTabs;
  selectedTab: string | undefined = 'map';

  constructor() {
    addIcons({ mapOutline, cameraOutline, personOutline, map, camera, person });
  }

  getSelectedTab() {
    this.selectedTab = this.tabs.getSelected();
  }
}
