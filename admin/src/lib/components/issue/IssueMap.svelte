<script lang="ts">
	import type { Issue } from '$lib/models/issue.model';
	import { mount, onMount } from 'svelte';
	import Marker from '$lib/components/issue/Marker.svelte';
	import { mapService } from '$lib/services/map.service';

	let { issue }: { issue: Issue } = $props();
	let mapElement: HTMLDivElement;

	onMount(async () => {
		const options = {
			center: { lat: issue.latitude, lng: issue.longitude },
			zoom: 14,
			mapId: 'issue-map',
			streetViewControl: false
		} as google.maps.MapOptions;

		const map = await mapService.createMap(mapElement, options);

		const { AdvancedMarkerElement } = (await mapService.loadLibrary(
			'marker'
		)) as google.maps.MarkerLibrary;

		const container = document.createElement('div');

		mount(Marker, {
			target: container,
			props: { issue }
		});

		new AdvancedMarkerElement({
			map,
			position: { lat: issue.latitude, lng: issue.longitude },
			content: container
		});
	});
</script>

<div bind:this={mapElement} class="h-140 w-auto rounded-xl xl:h-auto xl:w-140"></div>
