import type { Statistic } from '$lib/models/statistic.model';

class StatisticGraph {
	#statistic = $state<Statistic>({
		status: [],
		category: []
	});

	get statistic() {
		return this.#statistic;
	}

	set statistic(value: Statistic) {
		this.#statistic = value;
	}
}

export const statisticGraph = new StatisticGraph();
