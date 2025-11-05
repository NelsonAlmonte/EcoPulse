<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { DOMINICAN_REPUBLIC_COORDINATES } from '$lib/constants/system.constant';
	import { getBounds } from '$lib/utils/map';

	let mapElement: HTMLDivElement;
	let map: google.maps.Map;
	let isMapLoaded = $state(false);

	onMount(async () => {
		await initMap();
	});

	async function initMap(): Promise<void> {
		const { Loader } = await import('@googlemaps/js-api-loader');

		const loader = new Loader({
			apiKey: 'AIzaSyCNsKl8JuAYqzyMkcWy2Nspr9IPvg_jSNA',
			version: 'weekly'
		});

		await loader.load();

		const { Map } = (await google.maps.importLibrary('maps')) as google.maps.MapsLibrary;

		map = new Map(mapElement, {
			center: {
				lat: DOMINICAN_REPUBLIC_COORDINATES.lat,
				lng: DOMINICAN_REPUBLIC_COORDINATES.lng
			},
			zoom: 8,
			mapId: 'analytics-map',
			streetViewControl: false
		});

		map.addListener('idle', () => {
			setUrlBounds();
		});

		isMapLoaded = true;
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
