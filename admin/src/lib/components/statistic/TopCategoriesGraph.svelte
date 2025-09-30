<script lang="ts">
	import type { ApexOptions } from 'apexcharts';
	import type { Statistic } from '$lib/models/statistic.model';
	import type { AlertProps } from '$lib/types/ui.type';
	import { Chart } from '@flowbite-svelte-plugins/chart';
	import { Card } from 'flowbite-svelte';
	import SkeletonLoading from '$lib/components/statistic/SkeletonLoading.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { afterNavigate, beforeNavigate } from '$app/navigation';

	let { category }: { category: Statistic[] } = $props();
	let isEmpty = $derived.by(() => {
		return category.length === 0;
	});
	let isLoading = $state(false);
	let options: ApexOptions = $state({
		series: [
			{
				name: 'Incidencias',
				color: '#31C48D',
				data: category.slice(0, 5).map((val) => val.value)
			}
		],
		chart: {
			sparkline: {
				enabled: false
			},
			type: 'bar',
			width: '100%',
			height: 280,
			toolbar: {
				show: false
			}
		},
		fill: {
			opacity: 1
		},
		plotOptions: {
			bar: {
				horizontal: true,
				columnWidth: '100%',
				borderRadiusApplication: 'end',
				borderRadius: 6,
				dataLabels: {
					position: 'top'
				}
			}
		},
		legend: {
			show: true,
			position: 'bottom'
		},
		dataLabels: {
			enabled: false
		},
		tooltip: {
			shared: true,
			intersect: false
		},
		xaxis: {
			categories: category.slice(0, 5).map((val) => val.label),
			axisTicks: {
				show: false
			},
			axisBorder: {
				show: false
			}
		},
		yaxis: {
			labels: {
				show: true,
				style: {
					fontFamily: 'Inter, sans-serif',
					cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
				}
			}
		},
		grid: {
			show: true,
			strokeDashArray: 4,
			padding: {
				left: 2,
				right: 2,
				top: -20
			}
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
		const limit = category.length >= 5 ? 5 : category.length;
		options = {
			...options,
			series: [
				{
					name: 'Incidencias',
					color: '#31C48D',
					data: category.slice(0, limit).map((val) => val.value)
				}
			],
			xaxis: {
				categories: category.slice(0, limit).map((val) => val.label),
				axisTicks: {
					show: false
				},
				axisBorder: {
					show: false
				}
			}
		};

		isLoading = false;
	});
</script>

<Card class="p-4 md:p-6" size="lg">
	<h5 class="mb-4 text-xl font-bold leading-none text-gray-900 dark:text-white">
		Categorias con mas incidencias
	</h5>

	{#if isLoading}
		<SkeletonLoading />
	{:else if isEmpty}
		<Alert {alertProps} />
	{:else}
		<Chart {options} class="pt-6" />
	{/if}
</Card>
