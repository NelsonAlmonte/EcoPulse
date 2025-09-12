import { toastState } from '$lib/store/ui.svelte';

type Bounds = {
	north: number;
	south: number;
	east: number;
	west: number;
};

export function getBounds(map: google.maps.Map): Bounds | undefined {
	const bounds = map.getBounds();

	if (!bounds) {
		toastState.trigger({
			content: 'Error al obtener datos del mapa. Recargue la página.',
			color: 'red',
			icon: 'CircleX'
		});
		return;
	}

	const ne = bounds.getNorthEast();
	const sw = bounds.getSouthWest();

	return {
		north: ne.lat(),
		south: sw.lat(),
		east: ne.lng(),
		west: sw.lng()
	};
}
