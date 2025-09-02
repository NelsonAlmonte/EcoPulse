<script lang="ts">
	import type { Issue } from '$lib/models/issue.model';
	import { toastState } from '$lib/store/ui.svelte';
	import { onMount } from 'svelte';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { issueList } from '$lib/store/issue.svelte';
	import type { List } from '$lib/models/response.model';
	import { goto } from '$app/navigation';

	type Bounds = {
		north: number;
		south: number;
		east: number;
		west: number;
	};
	let mapElement: HTMLDivElement;
	let map: google.maps.Map;

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
			center: { lat: 18.7009047, lng: -70.1654584 },
			zoom: 11,
			mapId: 'issues-map',
			streetViewControl: false
		});

		map.addListener('idle', () => {
			getIssues();
			addMarkers();
		});
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

	async function getIssues(): Promise<List<Issue[]> | undefined> {
		const bounds = getBounds();

		if (!bounds) return;

		const { north, south, east, west } = bounds;
		// const apiUrl = new URL(`issue/in-bound`, PUBLIC_API_URL);
		const newUrl = new URL(window.location.href.split('?')[0]);

		newUrl.searchParams.set('north', north.toString());
		newUrl.searchParams.set('south', south.toString());
		newUrl.searchParams.set('east', east.toString());
		newUrl.searchParams.set('west', west.toString());

		goto(newUrl, { noScroll: true });
		// const response = await fetch(apiUrl);

		// if (!response.ok) {
		// 	toastState.trigger({
		// 		content: 'Error al obtener incidencias. Recargue la página.',
		// 		color: 'red',
		// 		icon: 'CircleX'
		// 	});
		// 	return;
		// }

		// return response.json();
	}

	async function addMarkers(): Promise<void> {
		// const issues = await getIssues();
		const { AdvancedMarkerElement } = (await google.maps.importLibrary(
			'marker'
		)) as google.maps.MarkerLibrary;

		// if (!issues) return;

		for (const issue of issueList.list.data) {
			const AdvancedMarkerElement = new google.maps.marker.AdvancedMarkerElement({
				map,
				position: {
					lat: issue.latitude,
					lng: issue.longitude
				}
			});
			AdvancedMarkerElement.addListener('click', () => {
				console.log(issue);
				AdvancedMarkerElement.map = null;
				AdvancedMarkerElement;
			});
		}
		// issueList.list = issues;
		// console.log(issueList.list.data);
	}
</script>

<div bind:this={mapElement} class="h-full w-full rounded-xl"></div>
