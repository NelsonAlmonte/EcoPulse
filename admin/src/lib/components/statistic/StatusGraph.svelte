<script lang="ts">
	import type { ApexOptions } from 'apexcharts';
	import { Card } from 'flowbite-svelte';
	import { Chart } from '@flowbite-svelte-plugins/chart';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import type { Statistic } from '$lib/models/statistic.model';

	let { status }: { status: Statistic[] } = $props();
	let isLoading = $state(false);
	let options: ApexOptions = $state({
		series: status.map((val) => val.value),
		colors: ['#fcd34d', '#059669', '#dc2626'],
		chart: {
			height: 320,
			width: '100%',
			type: 'donut'
		},
		stroke: {
			colors: ['transparent']
		},
		plotOptions: {
			pie: {
				donut: {
					labels: {
						show: true,
						name: {
							show: true,
							fontFamily: 'Inter, sans-serif',
							offsetY: 20
						},
						total: {
							showAlways: true,
							show: true,
							label: 'Total de incidencias',
							fontFamily: 'Inter, sans-serif',
							formatter: function (w) {
								const sum = w.globals.seriesTotals.reduce((a: number, b: number) => {
									return a + b;
								}, 0);
								return `${sum}`;
							}
						},
						value: {
							show: true,
							fontFamily: 'Inter, sans-serif',
							offsetY: -20,
							formatter: function (value) {
								return value;
							}
						}
					},
					size: '80%'
				}
			}
		},
		grid: {
			padding: {
				top: -2
			}
		},
		labels: status.map(
			(val) => val.label.toLowerCase().charAt(0).toUpperCase() + val.label.toLowerCase().slice(1)
		),
		dataLabels: {
			enabled: false
		},
		legend: {
			position: 'bottom',
			fontFamily: 'Inter, sans-serif'
		}
	});

	beforeNavigate(() => {
		isLoading = true;
	});

	afterNavigate(() => {
		options = {
			...options,
			series: status.map((val) => val.value)
		};

		isLoading = false;
	});
</script>

<Card class="rounded-xl p-4 md:p-6">
	<h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">Reporte por estados</h5>

	<div class="mt-4 rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
		<div class="mb-2 grid grid-cols-3 gap-3">
			<dl
				class="flex h-[78px] flex-col items-center justify-center rounded-lg bg-amber-50 dark:bg-gray-600"
			>
				<dt
					class="mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-sm font-medium text-amber-600 dark:bg-gray-500 dark:text-amber-300"
				>
					{status.find((val) => val.label === 'PENDIENTE')!.value}
				</dt>
				<dd class="text-sm font-medium text-amber-600 dark:text-amber-300">Pendiente</dd>
			</dl>
			<dl
				class="flex h-[78px] flex-col items-center justify-center rounded-lg bg-emerald-50 dark:bg-gray-600"
			>
				<dt
					class="mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-medium text-emerald-600 dark:bg-gray-500 dark:text-emerald-300"
				>
					{status.find((val) => val.label === 'RESUELTO')!.value}
				</dt>
				<dd class="text-sm font-medium text-emerald-600 dark:text-emerald-300">Resuelto</dd>
			</dl>
			<dl
				class="flex h-[78px] flex-col items-center justify-center rounded-lg bg-red-50 dark:bg-gray-600"
			>
				<dt
					class="mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-sm font-medium text-red-600 dark:bg-gray-500 dark:text-red-300"
				>
					{status.find((val) => val.label === 'DESCARTADO')!.value}
				</dt>
				<dd class="text-sm font-medium text-red-600 dark:text-red-300">Descartado</dd>
			</dl>
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
