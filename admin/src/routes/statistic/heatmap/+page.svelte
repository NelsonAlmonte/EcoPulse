<script lang="ts">
	import type { PageHeader } from '$lib/types/ui.type';
	import { pageHeaderState } from '$lib/store/ui.svelte';
	import { HeatmapLayer } from '@deck.gl/aggregation-layers';
	import { GoogleMapsOverlay } from '@deck.gl/google-maps';
	import { onMount } from 'svelte';
	let mapElement: HTMLDivElement;

	const pageHeaderProps: PageHeader = {
		title: 'Mapa de calor',
		back_url: '/',
		breadcrumbs: [
			{
				title: 'Inicio',
				url: '/'
			},
			{
				title: 'Estadísticas',
				url: '/statistic'
			},
			{
				title: 'Mapa de calor',
				url: '/statistic/heatmap'
			}
		]
	};

	Object.assign(pageHeaderState, pageHeaderProps);

	onMount(async () => {
		const { Loader } = await import('@googlemaps/js-api-loader');
		const loader = new Loader({ apiKey: 'AIzaSyCNsKl8JuAYqzyMkcWy2Nspr9IPvg_jSNA' });
		const DATA_URL =
			'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/sf-bike-parking.json';
		const data: any[] = await fetch(DATA_URL).then((r) => r.json());

		loader.importLibrary('maps').then((googlemaps) => {
			const map = new googlemaps.Map(mapElement, {
				center: { lat: 37.77325660358167, lng: -122.41712341793448 },
				zoom: 13,
				mapId: 'heatmap'
			});
			const overlay = new GoogleMapsOverlay({
				layers: [
					new HeatmapLayer({
						id: 'HeatmapLayer',
						data,
						getPosition: (d: any) => d.COORDINATES,
						getWeight: (d: any) => d.SPACES ?? 1,
						pickable: true
					})
				]
			});

			overlay.setMap(map);
		});
	});
</script>

<div bind:this={mapElement} class="h-180 w-full rounded-xl"></div>
