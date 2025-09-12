<script lang="ts">
	import type { PageProps } from './$types';
	import type { PageHeader } from '$lib/types/ui.type';
	import type { Issue } from '$lib/models/issue.model';
	import { onMount } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import { pageHeaderState } from '$lib/store/ui.svelte';
	import Filter from '$lib/components/issue/Filter.svelte';
	import { HeatmapLayer } from '@deck.gl/aggregation-layers';
	import { GoogleMapsOverlay } from '@deck.gl/google-maps';
	import { DOMINICAN_REPUBLIC_COORDINATES } from '$lib/constants/system.constant';
	import { Heading } from 'flowbite-svelte';

	let { data }: PageProps = $props();
	let map: google.maps.Map;
	let overlay: GoogleMapsOverlay;
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
		await initMap();
	});

	afterNavigate(() => {
		loadHeatLayer();
	});

	async function initMap() {
		const { Loader } = await import('@googlemaps/js-api-loader');
		const loader = new Loader({
			apiKey: 'AIzaSyCNsKl8JuAYqzyMkcWy2Nspr9IPvg_jSNA',
			version: 'weekly'
		});
		loader.importLibrary('maps').then((googlemaps) => {
			const { lat, lng } = DOMINICAN_REPUBLIC_COORDINATES;
			map = new googlemaps.Map(mapElement, {
				center: { lat, lng },
				zoom: 8,
				mapId: 'heatmap'
			});

			loadHeatLayer();
		});
	}

	function loadHeatLayer() {
		if (overlay) overlay.finalize();

		overlay = new GoogleMapsOverlay({
			layers: [
				new HeatmapLayer<Pick<Issue, 'latitude' | 'longitude'>>({
					id: 'HeatmapLayer',
					data: data.issues.data,
					getPosition: (d) => [d.longitude, d.latitude],
					pickable: true
				})
			]
		});

		if (map) overlay.setMap(map);
	}
</script>

<div class="mb-4 flex items-center justify-between">
	<Heading tag="h6">{data.issues.pagination.total} incidencias</Heading>
	<Filter />
</div>
<div bind:this={mapElement} class="h-170 w-full rounded-xl"></div>
