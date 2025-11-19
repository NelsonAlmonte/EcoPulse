import { Injectable, signal } from '@angular/core';
import { importLibrary, setOptions } from '@googlemaps/js-api-loader';
import { environment } from 'src/environments/environment';
import { Geolocation } from '@capacitor/geolocation';
import { Bounds } from '@shared/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  bounds = signal<Bounds | undefined>(undefined);

  constructor() {
    setOptions({ key: environment.googleMapsApiKey });
  }

  async createMap(
    el: google.maps.MapElement,
    options: google.maps.MapOptions
  ): Promise<google.maps.Map> {
    const { Map } = await importLibrary('maps');
    return new Map(el, options);
  }
}
