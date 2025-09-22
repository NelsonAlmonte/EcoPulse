<script lang="ts">
	import type { ApexOptions } from 'apexcharts';
	import type { Statistic } from '$lib/models/statistic.model';
	import { Chart } from '@flowbite-svelte-plugins/chart';
	import { Card } from 'flowbite-svelte';

	let { category }: { category: Statistic[] } = $props();

	const options: ApexOptions = {
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
			height: 400,
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
	};
</script>

<Card class="p-4 md:p-6">
	<h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">
		Categorias con mas incidencias
	</h5>

	<Chart {options} class="pt-6" />
</Card>
