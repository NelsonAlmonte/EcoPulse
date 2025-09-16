<script lang="ts">
	import type { ApexOptions } from 'apexcharts';
	import type { PageHeader } from '$lib/types/ui.type';
	import { Chart } from '@flowbite-svelte-plugins/chart';
	import { Card, A, Button, Dropdown, DropdownItem } from 'flowbite-svelte';
	import { pageHeaderState } from '$lib/store/ui.svelte';
	import type { StatusStatistic } from '$lib/models/statistic.model';

	let { status }: { status: StatusStatistic[] } = $props();
	const options: ApexOptions = {
		series: status.map((val) => val.value),
		colors: ['#059669', '#dc2626', '#fcd34d'],
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
			(val) => val.status.toLowerCase().charAt(0).toUpperCase() + val.status.toLowerCase().slice(1)
		),
		dataLabels: {
			enabled: false
		},
		legend: {
			position: 'bottom',
			fontFamily: 'Inter, sans-serif'
		}
	};

	const pageHeaderProps: PageHeader = {
		title: 'Reportes',
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
				title: 'Reportes',
				url: '/statistic'
			}
		]
	};

	Object.assign(pageHeaderState, pageHeaderProps);
</script>

<Card class="rounded-xl p-4 md:p-6">
	<h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">Reporte por estados</h5>

	<div class="rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
		<div class="mb-2 grid grid-cols-3 gap-3">
			<dl
				class="flex h-[78px] flex-col items-center justify-center rounded-lg bg-emerald-50 dark:bg-gray-600"
			>
				<dt
					class="mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-medium text-emerald-600 dark:bg-gray-500 dark:text-emerald-300"
				>
					{status.find((val) => val.status === 'RESUELTO')!.value}
				</dt>
				<dd class="text-sm font-medium text-emerald-600 dark:text-emerald-300">Resuelto</dd>
			</dl>
			<dl
				class="flex h-[78px] flex-col items-center justify-center rounded-lg bg-red-50 dark:bg-gray-600"
			>
				<dt
					class="mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-sm font-medium text-red-600 dark:bg-gray-500 dark:text-red-300"
				>
					{status.find((val) => val.status === 'DESCARTADO')!.value}
				</dt>
				<dd class="text-sm font-medium text-red-600 dark:text-red-300">Descartado</dd>
			</dl>
			<dl
				class="flex h-[78px] flex-col items-center justify-center rounded-lg bg-amber-50 dark:bg-gray-600"
			>
				<dt
					class="mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-sm font-medium text-amber-600 dark:bg-gray-500 dark:text-amber-300"
				>
					{status.find((val) => val.status === 'PENDIENTE')!.value}
				</dt>
				<dd class="text-sm font-medium text-amber-600 dark:text-amber-300">Pendiente</dd>
			</dl>
		</div>
	</div>

	<Chart {options} class="py-6" />

	<div
		class="grid grid-cols-1 items-center justify-between border-t border-gray-200 dark:border-gray-700"
	>
		<div class="flex items-center justify-between pt-5">
			<Button
				class="inline-flex items-center bg-transparent py-0 text-center text-sm font-medium text-gray-500 hover:bg-transparent hover:text-gray-900 focus:ring-transparent dark:bg-transparent dark:text-gray-400 dark:hover:bg-transparent dark:hover:text-white dark:focus:ring-transparent"
			>
				Last 7 days
				<!-- <ChevronDownOutline class="m-2.5 ms-1.5 w-2.5" /> -->
			</Button>
			<Dropdown simple class="w-40" offset={-6}>
				<DropdownItem>Yesterday</DropdownItem>
				<DropdownItem>Today</DropdownItem>
				<DropdownItem>Last 7 days</DropdownItem>
				<DropdownItem>Last 30 days</DropdownItem>
				<DropdownItem>Last 90 days</DropdownItem>
			</Dropdown>
		</div>
	</div>
</Card>
