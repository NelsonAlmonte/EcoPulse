<script lang="ts">
	import { onMount } from 'svelte';

	let { latitude, longitude }: { latitude: number; longitude: number } = $props();
	let mapElement: HTMLDivElement;

	onMount(async () => {
		const { Loader } = await import('@googlemaps/js-api-loader');

		const loader = new Loader({
			apiKey: 'AIzaSyCNsKl8JuAYqzyMkcWy2Nspr9IPvg_jSNA',
			version: 'weekly'
		});

		await loader.load();

		const { Map } = (await google.maps.importLibrary('maps')) as google.maps.MapsLibrary;
		const { AdvancedMarkerElement } = (await google.maps.importLibrary(
			'marker'
		)) as google.maps.MarkerLibrary;
		const map = new Map(mapElement, {
			center: { lat: latitude, lng: longitude },
			zoom: 14,
			mapId: 'issue-map',
			streetViewControl: false
		});

		new AdvancedMarkerElement({
			map,
			position: { lat: latitude, lng: longitude }
		});
	});
</script>

<div bind:this={mapElement} class="w-140 h-auto rounded-xl"></div>
