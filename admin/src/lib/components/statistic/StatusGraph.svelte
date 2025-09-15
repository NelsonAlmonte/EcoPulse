<script lang="ts">
	import type { ApexOptions } from 'apexcharts';
	import type { PageHeader } from '$lib/types/ui.type';
	import { Chart } from '@flowbite-svelte-plugins/chart';
	import { Card, A, Button, Dropdown, DropdownItem } from 'flowbite-svelte';
	import { pageHeaderState } from '$lib/store/ui.svelte';

	const options: ApexOptions = {
		series: [35.1, 23.5, 2.4],
		colors: ['#1C64F2', '#16BDCA', '#FDBA8C'],
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
								return `${sum}k`;
							}
						},
						value: {
							show: true,
							fontFamily: 'Inter, sans-serif',
							offsetY: -20,
							formatter: function (value) {
								return value + 'k';
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
		labels: ['Pendientes', 'Resueltos', 'Descartados'],
		dataLabels: {
			enabled: false
		},
		legend: {
			position: 'bottom',
			fontFamily: 'Inter, sans-serif'
		},
		yaxis: {
			labels: {
				formatter: function (value) {
					return value + 'k';
				}
			}
		},
		xaxis: {
			labels: {
				formatter: function (value) {
					return value + 'k';
				}
			},
			axisTicks: {
				show: false
			},
			axisBorder: {
				show: false
			}
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

<Card class="p-4 md:p-6">
	<div class="flex w-full items-start justify-between">
		<div class="flex-col items-center">
			<div class="mb-1 flex items-center">
				<h5 class="me-1 text-xl font-bold leading-none text-gray-900 dark:text-white">
					Estados de incidencias
				</h5>
			</div>
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
			<A
				href="/"
				class="hover:text-primary-700 dark:hover:text-primary-500 rounded-lg px-3 py-2 text-sm font-semibold uppercase hover:bg-gray-100 hover:no-underline dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
			>
				Traffic analysis
				<!-- <ChevronRightOutline class="ms-1.5 h-2.5 w-2.5" /> -->
			</A>
		</div>
	</div>
</Card>
