<script lang="ts">
	import { mount, onMount } from 'svelte';
	import { issueList } from '$lib/store/issue.svelte';
	import { afterNavigate, goto } from '$app/navigation';
	import Marker from '$lib/components/issue/Marker.svelte';
	import { DOMINICAN_REPUBLIC_COORDINATES } from '$lib/constants/system.constant';
	import { getBounds } from '$lib/utils/map';

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
		const { Loader } = await import('@googlemaps/js-api-loader');

		const loader = new Loader({
			apiKey: 'AIzaSyCNsKl8JuAYqzyMkcWy2Nspr9IPvg_jSNA',
			version: 'weekly'
		});

		await loader.load();

		const { Map } = (await google.maps.importLibrary('maps')) as google.maps.MapsLibrary;

		map = new Map(mapElement, {
			center: {
				lat: lat !== '' ? Number(lat) : DOMINICAN_REPUBLIC_COORDINATES.lat,
				lng: lng !== '' ? Number(lng) : DOMINICAN_REPUBLIC_COORDINATES.lng
			},
			zoom: zoom !== '' ? Number(zoom) : 8,
			mapId: 'issues-map',
			streetViewControl: false
		});

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
		const { AdvancedMarkerElement } = (await google.maps.importLibrary(
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

			const AdvancedMarkerElement = new google.maps.marker.AdvancedMarkerElement({
				map,
				position: {
					lat: issue.latitude,
					lng: issue.longitude
				},
				content: container
			});

			markers.push(AdvancedMarkerElement);
		}
	}

	function removeMarkers(): void {
		for (const marker of markers) {
			marker.map = null;
		}
		markers = [];
	}
</script>

<div bind:this={mapElement} class="h-full w-full rounded-xl"></div>
