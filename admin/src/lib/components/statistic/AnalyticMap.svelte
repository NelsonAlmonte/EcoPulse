<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { DOMINICAN_REPUBLIC_COORDINATES } from '$lib/constants/system.constant';
	import { getBounds } from '$lib/utils/map';
	import { mapService } from '$lib/services/map.service';

	let mapElement: HTMLDivElement;
	let map: google.maps.Map;

	onMount(async () => {
		await initMap();
	});

	async function initMap(): Promise<void> {
		const options = {
			center: {
				lat: DOMINICAN_REPUBLIC_COORDINATES.lat,
				lng: DOMINICAN_REPUBLIC_COORDINATES.lng
			},
			zoom: 8,
			mapId: 'analytics-map',
			streetViewControl: false
		} as google.maps.MapOptions;

		map = await mapService.createMap(mapElement, options);

		map.addListener('idle', () => {
			setUrlBounds();
		});
	}

	function setUrlBounds(): void {
		const bounds = getBounds(map);

		if (!bounds) return;

		const { north, south, east, west } = bounds;
		const newUrl = new URL(window.location.href);

		newUrl.searchParams.set('north', north.toString());
		newUrl.searchParams.set('south', south.toString());
		newUrl.searchParams.set('east', east.toString());
		newUrl.searchParams.set('west', west.toString());

		goto(newUrl, { noScroll: true });
	}
</script>

<div bind:this={mapElement} class="h-140 w-full rounded-xl lg:h-full"></div>
