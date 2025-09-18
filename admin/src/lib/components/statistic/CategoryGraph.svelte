<script lang="ts">
	import type { ApexOptions } from 'apexcharts';
	import type { CategoryStatistic } from '$lib/models/statistic.model';
	import { Card } from 'flowbite-svelte';
	import { Chart } from '@flowbite-svelte-plugins/chart';
	import { FileSearch } from '@lucide/svelte';
	import { afterNavigate, beforeNavigate } from '$app/navigation';

	let { category }: { category: CategoryStatistic[] } = $props();
	let totalIssues = $derived.by(() => {
		return category.reduce((accumulator, currentValue) => accumulator + currentValue.value, 0);
	});
	let isLoading = $state(false);
	let options: ApexOptions = $state({
		colors: ['#1A56DB'],
		series: [
			{
				name: 'Incidencias',
				color: '#1A56DB',
				data: category.map((val) => ({ x: val.category, y: val.value }))
			}
		],
		chart: {
			type: 'bar',
			height: '320px',
			// width: '500px',
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
					data: category.map((val) => ({ x: val.category, y: val.value }))
				}
			]
		};

		isLoading = false;
	});
</script>

<Card class="rounded-xl p-4 md:p-6">
	<h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">
		Reporte por categorias
	</h5>
	<div class="my-4">
		<div class="flex items-center">
			<div
				class="me-3 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700"
			>
				<FileSearch class="h-6 w-6 text-gray-500 dark:text-gray-400" />
			</div>
			<div>
				<h5 class="pb-1 text-2xl font-bold leading-none text-gray-900 dark:text-white">
					{totalIssues}
				</h5>
				<p class="text-sm font-normal text-gray-500 dark:text-gray-400">Total de incidencias</p>
			</div>
		</div>
	</div>

	{#if isLoading}
		<div role="status" class="max-w-sm animate-pulse md:p-6">
			<div class="mt-4 flex items-baseline">
				<div class="h-72 w-full rounded-t-lg bg-gray-200 dark:bg-gray-700"></div>
				<div class="ms-6 h-56 w-full rounded-t-lg bg-gray-200 dark:bg-gray-700"></div>
				<div class="ms-6 h-72 w-full rounded-t-lg bg-gray-200 dark:bg-gray-700"></div>
				<div class="ms-6 h-64 w-full rounded-t-lg bg-gray-200 dark:bg-gray-700"></div>
				<div class="ms-6 h-80 w-full rounded-t-lg bg-gray-200 dark:bg-gray-700"></div>
				<div class="ms-6 h-72 w-full rounded-t-lg bg-gray-200 dark:bg-gray-700"></div>
				<div class="ms-6 h-80 w-full rounded-t-lg bg-gray-200 dark:bg-gray-700"></div>
			</div>
			<span class="sr-only">Loading...</span>
		</div>
	{:else}
		<Chart {options} class="py-6" />
	{/if}
</Card>
