<script lang="ts">
	import type { Statistic } from '$lib/models/statistic.model';
	import type { ApexOptions } from 'apexcharts';
	import { Chart } from '@flowbite-svelte-plugins/chart';
	import { Card } from 'flowbite-svelte';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { FileSearch } from '@lucide/svelte';

	let { date }: { date: Statistic[] } = $props();
	let totalIssues = $derived.by(() => {
		return date.reduce((accumulator, currentValue) => accumulator + currentValue.value, 0);
	});
	let isLoading = $state(false);
	let options: ApexOptions = $state({
		chart: {
			height: '500px',
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

<Card class="rounded-xl p-4 md:p-6">
	<h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">Reporte por fecha</h5>
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
		<Chart {options} class="pt-6" />
	{/if}
</Card>
