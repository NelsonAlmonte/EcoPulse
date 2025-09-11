<script lang="ts">
	import type { PageProps } from './$types';
	import type { PageHeader } from '$lib/types/ui.type';
	import type { Issue } from '$lib/models/issue.model';
	import { onMount } from 'svelte';
	import { pageHeaderState } from '$lib/store/ui.svelte';
	import { HeatmapLayer } from '@deck.gl/aggregation-layers';
	import { GoogleMapsOverlay } from '@deck.gl/google-maps';
	import { DOMINICAN_REPUBLIC_COORDINATES } from '$lib/constants/system.constant';

	let { data }: PageProps = $props();
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

	async function initMap() {
		const { Loader } = await import('@googlemaps/js-api-loader');
		const loader = new Loader({ apiKey: 'AIzaSyCNsKl8JuAYqzyMkcWy2Nspr9IPvg_jSNA' });

		loader.importLibrary('maps').then((googlemaps) => {
			const { lat, lng } = DOMINICAN_REPUBLIC_COORDINATES;
			const map = new googlemaps.Map(mapElement, {
				center: { lat, lng },
				zoom: 8,
				mapId: 'heatmap'
			});
			const overlay = new GoogleMapsOverlay({
				layers: [
					new HeatmapLayer<Issue>({
						id: 'HeatmapLayer',
						data: data.issues,
						getPosition: (d: Issue) => [d.longitude, d.latitude],
						pickable: true
					})
				]
			});

			overlay.setMap(map);
		});
	}
</script>

<div bind:this={mapElement} class="h-180 w-full rounded-xl"></div>
