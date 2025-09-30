<script lang="ts">
	import type { ApexOptions } from 'apexcharts';
	import type { Statistic } from '$lib/models/statistic.model';
	import type { AlertProps } from '$lib/types/ui.type';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { Card } from 'flowbite-svelte';
	import { Chart } from '@flowbite-svelte-plugins/chart';
	import SkeletonLoading from '$lib/components/statistic/SkeletonLoading.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';

	let { category }: { category: Statistic[] } = $props();
	let isEmpty = $derived.by(() => {
		return category.length === 0;
	});
	console.log(category);
	let isLoading = $state(false);
	let options: ApexOptions = $state({
		colors: ['#1A56DB'],
		series: [
			{
				name: 'Incidencias',
				color: '#1A56DB',
				data: category.map((val) => ({ x: val.label, y: val.value }))
			}
		],
		chart: {
			type: 'bar',
			height: '280px',
			// width: '100%',
			fontFamily: 'Inter, sans-serif',
			toolbar: {
				show: false
			}
		},
		plotOptions: {
			bar: {
				horizontal: false,
				columnWidth: '70%',
				borderRadiusApplication: 'end',
				borderRadius: 8
			}
		},
		tooltip: {
			shared: true,
			intersect: false,
			style: {
				fontFamily: 'Inter, sans-serif'
			}
		},
		states: {
			hover: {
				filter: {
					type: 'darken'
				}
			}
		},
		stroke: {
			show: true,
			width: 0,
			colors: ['transparent']
		},
		grid: {
			show: false,
			strokeDashArray: 4,
			padding: {
				left: 2,
				right: 2,
				top: -14
			}
		},
		dataLabels: {
			enabled: false
		},
		legend: {
			show: false
		},
		xaxis: {
			floating: false,
			labels: {
				show: true,
				style: {
					fontFamily: 'Inter, sans-serif',
					cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
				}
			},
			axisBorder: {
				show: false
			},
			axisTicks: {
				show: false
			}
		},
		yaxis: {
			show: false
		},
		fill: {
			opacity: 1
		}
	});
	const alertProps: AlertProps = {
		title: 'Sin resultados',
		content: 'No se encontraron reportes para este gráfico.',
		subcontent: 'Selecciona otro periodo de tiempo para visualizar datos.',
		classes: ['bg-gray-50 dark:bg-gray-700']
	};

	beforeNavigate(() => {
		isLoading = true;
	});

	afterNavigate(() => {
		options = {
			...options,
			series: [
				{
					name: 'Incidencias',
					color: '#1A56DB',
					data: category.map((val) => ({ x: val.label, y: val.value }))
				}
			]
		};

		isLoading = false;
	});
</script>

<Card class="max-w-full rounded-xl p-4 md:p-6">
	<h5 class="mb-4 text-xl font-bold leading-none text-gray-900 dark:text-white">
		Reporte por categorias
	</h5>
	{#if isLoading}
		<SkeletonLoading />
	{:else if isEmpty}
		<Alert {alertProps} />
	{:else}
		<Chart {options} class="pt-6" />
	{/if}
</Card>
