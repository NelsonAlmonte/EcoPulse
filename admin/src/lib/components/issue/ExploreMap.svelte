<script lang="ts">
	import { mount, onMount } from 'svelte';
	import { issueList } from '$lib/store/issue.svelte';
	import { afterNavigate, goto } from '$app/navigation';
	import Marker from '$lib/components/issue/Marker.svelte';
	import { DOMINICAN_REPUBLIC_COORDINATES } from '$lib/constants/system.constant';
	import { getBounds } from '$lib/utils/map';
	import { mapService } from '$lib/services/map.service';

	let { lat, lng, zoom }: { lat: string; lng: string; zoom: string } = $props();
	let mapElement: HTMLDivElement;
	let map: google.maps.Map;
	let markers: google.maps.marker.AdvancedMarkerElement[] = [];
	let isMapLoaded = $state(false);

	onMount(async () => {
		await initMap();
	});

	afterNavigate(async () => {
		removeMarkers();

		if (isMapLoaded) await addMarkers();
	});

	async function initMap(): Promise<void> {
		const options = {
			mapId: 'issues-map',
			center: {
				lat: lat !== '' ? Number(lat) : DOMINICAN_REPUBLIC_COORDINATES.lat,
				lng: lng !== '' ? Number(lng) : DOMINICAN_REPUBLIC_COORDINATES.lng
			},
			zoom: zoom !== '' ? Number(zoom) : 8,
			streetViewControl: false
		} as google.maps.MapOptions;

		map = await mapService.createMap(mapElement, options);

		map.addListener('idle', () => {
			getIssues();
		});

		isMapLoaded = true;
	}

	function getIssues(): void {
		const bounds = getBounds(map);

		if (!bounds) return;

		const { north, south, east, west } = bounds;
		const newUrl = new URL(window.location.href);

		newUrl.searchParams.set('north', north.toString());
		newUrl.searchParams.set('south', south.toString());
		newUrl.searchParams.set('east', east.toString());
		newUrl.searchParams.set('west', west.toString());
		newUrl.searchParams.set('page', '1');
		newUrl.searchParams.set('amount', '6');

		goto(newUrl, { noScroll: true });
	}

	async function addMarkers(): Promise<void> {
		const { AdvancedMarkerElement } = (await mapService.loadLibrary(
			'marker'
		)) as google.maps.MarkerLibrary;

		for (const issue of issueList.list.data) {
			const container = document.createElement('div');

			mount(Marker, {
				target: container,
				props: {
					issue: issue
				}
			});

			const marker = new AdvancedMarkerElement({
				map,
				position: {
					lat: issue.latitude,
					lng: issue.longitude
				},
				content: container
			});

			markers.push(marker);
		}
	}

	function removeMarkers(): void {
		for (const marker of markers) {
			marker.map = null;
		}
		markers = [];
	}
</script>

<div bind:this={mapElement} class="h-140 w-full rounded-xl lg:h-full"></div>
