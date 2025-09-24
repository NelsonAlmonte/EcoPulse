<script lang="ts">
	import type { PageHeader } from '$lib/types/ui.type';
	import type { Issue } from '$lib/models/issue.model';
	import { onMount } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import { pageHeaderState, toastState } from '$lib/store/ui.svelte';
	import { Deck } from '@deck.gl/core';
	import { HeatmapLayer } from '@deck.gl/aggregation-layers';
	import { GoogleMapsOverlay } from '@deck.gl/google-maps';
	import { DOMINICAN_REPUBLIC_COORDINATES } from '$lib/constants/system.constant';

	let { issues }: { issues: Pick<Issue, 'latitude' | 'longitude'>[] } = $props();
	let map: google.maps.Map;
	let overlay: GoogleMapsOverlay;
	let mapElement: HTMLDivElement;
	let marker: google.maps.marker.AdvancedMarkerElement | undefined;
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

		loader.importLibrary('maps').then(async (googlemaps) => {
			const { AdvancedMarkerElement } = (await google.maps.importLibrary(
				'marker'
			)) as google.maps.MarkerLibrary;
			const { lat, lng } = DOMINICAN_REPUBLIC_COORDINATES;

			map = new googlemaps.Map(mapElement, {
				center: { lat, lng },
				zoom: 8,
				mapId: 'heatmap'
			});

			loadHeatLayer();

			const infoWindow = new googlemaps.InfoWindow();

			map.addListener('click', (event: google.maps.MapMouseEvent) => {
				const position = event.latLng;

				if (!position) {
					toastState.trigger({
						content: 'Error al obtener las coordenadas del sitio. Recargue la página.',
						color: 'red',
						icon: 'CircleX'
					});
					return;
				}

				const zoom = map.getZoom();

				if (!zoom) {
					toastState.trigger({
						content: 'Error al obtener el zoom del sitio. Recargue la página.',
						color: 'red',
						icon: 'CircleX'
					});
					return;
				}

				const newUrl = new URL('/issue/map', window.location.origin);

				newUrl.searchParams.set('lat', position.lat().toString());
				newUrl.searchParams.set('lng', position.lng().toString());
				newUrl.searchParams.set('zoom', zoom.toString());
				newUrl.searchParams.set('page', '1');
				newUrl.searchParams.set('amount', '6');

				const content = `
						<div class="text-base font-medium hover:text-emerald-700 hover:underline"><a href="${newUrl.pathname + newUrl.search}" >Ver zona en el mapa de incidencias</a></div>
					`;

				if (!marker) {
					marker = new AdvancedMarkerElement({
						map: map,
						position
					});

					marker.addListener('click', () => {
						infoWindow.close();
						infoWindow.setContent(content);
						infoWindow.open(map, marker);
					});

					infoWindow.setContent(content);
					infoWindow.open(map, marker);
				} else {
					marker.position = position;
					infoWindow.setContent(content);
					infoWindow.open(map, marker);
				}
			});
		});
	}

	function loadHeatLayer() {
		if (overlay) overlay.finalize();

		overlay = new GoogleMapsOverlay({
			layers: [
				new HeatmapLayer<Pick<Issue, 'latitude' | 'longitude'>>({
					id: 'HeatmapLayer',
					data: issues,
					getPosition: (d) => [d.longitude, d.latitude],
					pickable: true
				})
			]
		});

		if (map) overlay.setMap(map);
	}
</script>

<div bind:this={mapElement} class="h-170 w-full rounded-xl"></div>
