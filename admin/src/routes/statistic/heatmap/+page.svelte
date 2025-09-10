<script lang="ts">
	import type { PageHeader } from '$lib/types/ui.type';
	import { pageHeaderState } from '$lib/store/ui.svelte';
	import { HeatmapLayer } from '@deck.gl/aggregation-layers';
	import { GoogleMapsOverlay } from '@deck.gl/google-maps';
	import { onMount } from 'svelte';
	import { Deck } from '@deck.gl/core';

	let mapElement: HTMLDivElement;
	let heatmapLayer: HeatmapLayer;
	let googleMapsOverlay: GoogleMapsOverlay;

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
		const loader = new Loader({
			apiKey: 'AIzaSyCNsKl8JuAYqzyMkcWy2Nspr9IPvg_jSNA',
			version: 'weekly'
		});

		await loader.load();

		const position = { lat: 37.77325660358167, lng: -122.41712341793448 };
		const { Map } = (await google.maps.importLibrary('maps')) as google.maps.MapsLibrary;

		const map = new Map(mapElement, {
			zoom: 13, // Using the zoom from original deckgl-polygon.js
			center: position,
			mapId: '6b73a9fe7e831a00',
			fullscreenControl: false, // Disable fullscreen control
			clickableIcons: false // Disable clicks on base map POIs
		});

		// heatmapLayer = new HeatmapLayer({
		// 	// Assign to the outer heatmapLayer
		// 	id: 'HeatmapLayer', // Change layer ID
		// 	data: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/sf-bike-parking.json', // Use the loaded data
		// 	getPosition: (d: any) => d.COORDINATES, // Use 'any' for simplicity, or define a proper type
		// 	getWeight: (d: any) => d.SPACES, // Use 'any' for simplicity, or define a proper type
		// 	radiusPixels: 25, // Adjust radius as in user's example
		// 	visible: true,
		// 	pickable: true
		// });

		// googleMapsOverlay = new GoogleMapsOverlay({
		// 	layers: [heatmapLayer]
		// });

		// googleMapsOverlay.setMap(map);

		// new Deck({
		// 	initialViewState: {
		// 		latitude: 37.77325660358167,
		// 		longitude: -122.41712341793448,
		// 		zoom: 13
		// 	},
		// 	// Assign to the outer googleMapsOverlay
		// 	layers: [heatmapLayer],
		// 	controller: true // Enable Deck.gl to control map view
		// });

		// googleMapsOverlay.setMap(map);
		const DATA_URL =
			'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/sf-bike-parking.json';

		const data: any[] = await fetch(DATA_URL).then((r) => r.json());

		// calcula max para normalizar (evita saturación)
		const maxWeight = Math.max(1, ...data.map((d) => d.SPACES ?? 1));

		// device pixel ratio para evitar apariencia pixelada en pantallas HiDPI
		const dpr = Math.max(1, window.devicePixelRatio || 1);

		// configurar colorRange que te de un gradiente legible
		const colorRange = [
			[33, 102, 172],
			[67, 147, 195],
			[146, 197, 222],
			[209, 229, 240],
			[253, 219, 199],
			[244, 165, 130],
			[214, 96, 77],
			[178, 24, 43]
		];

		const heatmapLayer = new HeatmapLayer({
			id: 'HeatmapLayer',
			data,
			// si COORDINATES viene como [lng, lat] funcionará; si vienen [lat, lng] invierte.
			getPosition: (d: any) => d.COORDINATES,
			// normaliza el peso entre 0 y 1
			getWeight: (d: any) => (d.SPACES ?? 1) / maxWeight,
			// aumenta radius para que no quede puntilloso; escala con DPR
			radiusPixels: Math.round(40 * dpr),
			intensity: 2, // ajusta para mayor o menor "difuminado"
			threshold: 0.03, // controla el corte; bajalo si quieres más relleno
			opacity: 0.8,
			pickable: true
		});

		// crea overlay correcto y asócialo al mapa de google
		const overlay = new GoogleMapsOverlay({
			layers: [heatmapLayer]
		});

		// Asignar overlay al mapa — esto coloca el canvas de deck.gl en el pane correcto
		overlay.setMap(map);

		debugHeatmap(overlay, data);
	});

	function debugHeatmap(overlay: any, data: any[]) {
		console.log('=== DEBUG HEATMAP ===');
		// 1. Canvas sizing
		const canv = document.querySelector('canvas');
		if (canv) {
			console.log('Canvas client:', canv.clientWidth, canv.clientHeight);
			console.log('Canvas backing store:', canv.width, canv.height);
			console.log('DevicePixelRatio:', window.devicePixelRatio);
			if (canv.width !== canv.clientWidth * window.devicePixelRatio) {
				console.warn('⚠️ DPR mismatch: heatmap puede verse pixelado');
			}
		} else {
			console.warn('No se encontró canvas de deck.gl');
		}

		// 2. Datos y pesos
		const sample = data.slice(0, 5).map((d) => ({
			coords: d.COORDINATES,
			spaces: d.SPACES
		}));
		console.log('Sample de datos:', sample);

		const weights = data.map((d) => d.SPACES ?? 1);
		const maxW = Math.max(...weights);
		const minW = Math.min(...weights);
		console.log('Weight range:', { min: minW, max: maxW });

		if (maxW / Math.max(minW, 1) > 100) {
			console.warn('⚠️ Rango de pesos muy amplio, posible saturación (colores planos)');
		}
	}
</script>

<div bind:this={mapElement} class="h-180 w-full rounded-xl"></div>
