<script lang="ts">
	import type { Statistic } from '$lib/models/statistic.model';
	import type { ApexOptions } from 'apexcharts';
	import type { AlertProps } from '$lib/types/ui.type';
	import { Chart } from '@flowbite-svelte-plugins/chart';
	import { Card } from 'flowbite-svelte';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import SkeletonLoading from './SkeletonLoading.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';

	let { date }: { date: Statistic[] } = $props();
	let isEmpty = $derived.by(() => {
		return date.length === 0;
	});
	let isLoading = $state(false);
	let options: ApexOptions = $state({
		chart: {
			height: 340,
			type: 'area',
			fontFamily: 'Inter, sans-serif',
			dropShadow: {
				enabled: false
			},
			toolbar: {
				show: false
			}
		},
		tooltip: {
			enabled: true,
			x: {
				show: false
			}
		},
		dataLabels: {
			enabled: true
		},
		stroke: {
			curve: 'smooth'
		},
		grid: {
			show: true,
			strokeDashArray: 4,
			padding: {
				left: 2,
				right: 2,
				top: -26
			}
		},
		series: [
			{
				name: 'Incidencias',
				data: date.map((val) => val.value),
				color: '#7E3AF2'
			}
		],
		legend: {
			show: false
		},
		xaxis: {
			categories: date.map((val) => val.label),
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
		}
		// yaxis: {
		// 	show: false
		// }
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
					data: date.map((val) => val.value),
					color: '#7E3AF2'
				}
			],
			xaxis: {
				categories: date.map((val) => val.label)
			}
		};

		isLoading = false;
	});
</script>

<Card class="max-w-full rounded-xl p-4 md:p-6">
	<h5 class="mb-4 text-xl font-bold leading-none text-gray-900 dark:text-white">
		Reporte por fecha
	</h5>
	{#if isLoading}
		<SkeletonLoading />
	{:else if isEmpty}
		<Alert {alertProps} />
	{:else}
		<Chart {options} class="pt-6" />
	{/if}
</Card>
