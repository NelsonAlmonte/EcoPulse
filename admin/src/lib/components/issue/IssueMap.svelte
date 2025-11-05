<script lang="ts">
	import { mount, onMount } from 'svelte';
	import Marker from '$lib/components/issue/Marker.svelte';
	import type { Issue } from '$lib/models/issue.model';

	let { issue }: { issue: Issue } = $props();
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
			center: { lat: issue.latitude, lng: issue.longitude },
			zoom: 14,
			mapId: 'issue-map',
			streetViewControl: false
		});
		const container = document.createElement('div');

		mount(Marker, {
			target: container,
			props: {
				issue: issue
			}
		});

		new AdvancedMarkerElement({
			map,
			position: { lat: issue.latitude, lng: issue.longitude },
			content: container
		});
	});
</script>

<div bind:this={mapElement} class="h-140 xl:w-140 w-auto rounded-xl xl:h-auto"></div>
