<script lang="ts">
	import type { ApexOptions } from 'apexcharts';
	import { Chart } from '@flowbite-svelte-plugins/chart';
	import { Card, A, Button, Dropdown, DropdownItem } from 'flowbite-svelte';
	import type { CategoryStatistic } from '$lib/models/statistic.model';
	import { FileSearch } from '@lucide/svelte';

	let { category }: { category: CategoryStatistic[] } = $props();
	// const initialValue = 0;
	let totalIssues = category.reduce(
		(accumulator, currentValue) => accumulator + currentValue.value,
		0
	);
	let options: ApexOptions = {
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
	};

	function foo() {
		options = {
			...options,
			series: [{ name: 'New users', data: [{ x: 'Animal muerto', y: 231 }], color: '#1A56DB' }]
		};
	}
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
	<Chart {options} />
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
