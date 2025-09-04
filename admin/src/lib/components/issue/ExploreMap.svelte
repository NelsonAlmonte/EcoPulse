<script lang="ts">
	import { toastState } from '$lib/store/ui.svelte';
	import { mount, onMount } from 'svelte';
	import { issueList } from '$lib/store/issue.svelte';
	import { afterNavigate, goto } from '$app/navigation';
	import Marker from '$lib/components/issue/Marker.svelte';

	type Bounds = {
		north: number;
		south: number;
		east: number;
		west: number;
	};
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
			center: { lat: 18.7009047, lng: -70.1654584 },
			zoom: 8,
			mapId: 'issues-map',
			streetViewControl: false
		});

		map.addListener('idle', () => {
			getIssues();
		});

		isMapLoaded = true;
	}

	function getBounds(): Bounds | undefined {
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

	function getIssues(): void {
		const bounds = getBounds();

		if (!bounds) return;

		const { north, south, east, west } = bounds;
		const newUrl = new URL(window.location.href.split('?')[0]);

		newUrl.searchParams.set('north', north.toString());
		newUrl.searchParams.set('south', south.toString());
		newUrl.searchParams.set('east', east.toString());
		newUrl.searchParams.set('west', west.toString());

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
