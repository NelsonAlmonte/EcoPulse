import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import { PUBLIC_GOOGLE_MAPS_API_KEY } from '$env/static/public';

class MapService {
	#isInitialized = false;
	#initPromise: Promise<void> | null = null;

	private init() {
		if (this.#isInitialized) return;

		if (!this.#initPromise) {
			this.#initPromise = (async () => {
				setOptions({
					key: PUBLIC_GOOGLE_MAPS_API_KEY,
					v: 'weekly'
				});

				this.#isInitialized = true;
			})();
		}

		return this.#initPromise;
	}

	async loadLibrary<T extends 'maps' | 'marker' | 'places'>(lib: T) {
		await this.init();
		return importLibrary(lib);
	}

	async createMap(el: HTMLElement, options: google.maps.MapOptions): Promise<google.maps.Map> {
		await this.init();

		const { Map } = (await importLibrary('maps')) as google.maps.MapsLibrary;

		return new Map(el, options);
	}
}

export const mapService = new MapService();
