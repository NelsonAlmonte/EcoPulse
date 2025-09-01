<script lang="ts">
	import type { PageHeader } from '$lib/types/ui.type';
	import { pageHeaderState, toastState } from '$lib/store/ui.svelte';
	import { onMount } from 'svelte';
	import { PUBLIC_API_URL } from '$env/static/public';
	import type { Issue } from '$lib/models/issue.model';
	import IssueList from '$lib/components/issue/IssueList.svelte';

	const pageHeaderProps: PageHeader = {
		title: 'Mapa de incidencias',
		back_url: '/issue',
		breadcrumbs: [
			{
				title: 'Inicio',
				url: '/'
			},
			{
				title: 'Incidencias',
				url: '/issue'
			},
			{
				title: 'Mapa',
				url: '/'
			}
		]
	};
	let mapElement: HTMLDivElement;
	let map: google.maps.Map;

	onMount(async () => {
		await initMap();
	});

	async function initMap() {
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

	function getBounds() {
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

	async function getIssues(): Promise<Issue[] | undefined> {
		const bounds = getBounds();

		if (!bounds) return;

		const { north, south, east, west } = bounds;
		const apiUrl = new URL(`issue/in-bound`, PUBLIC_API_URL);

		apiUrl.searchParams.set('north', north.toString());
		apiUrl.searchParams.set('south', south.toString());
		apiUrl.searchParams.set('east', east.toString());
		apiUrl.searchParams.set('west', west.toString());

		const response = await fetch(apiUrl);

		if (!response.ok) {
			toastState.trigger({
				content: 'Error al obtener incidencias. Recargue la página.',
				color: 'red',
				icon: 'CircleX'
			});
			return;
		}

		return response.json();
	}

	async function addMarkers() {
		const issues = await getIssues();
		const { AdvancedMarkerElement } = (await google.maps.importLibrary(
			'marker'
		)) as google.maps.MarkerLibrary;

		if (!issues) return;

		for (const issue of issues) {
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
	}

	Object.assign(pageHeaderState, pageHeaderProps);
</script>

<div class="grid grid-cols-2 gap-8">
	<div class="w-full">
		<IssueList />
	</div>
	<div bind:this={mapElement} class="h-full w-full rounded-xl"></div>
</div>
