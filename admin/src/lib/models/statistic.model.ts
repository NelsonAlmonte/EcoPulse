export type Statistic = {
	status: StatusStatistic[];
	category: CategoryStatistic[];
};

export type StatusStatistic = {
	status: string;
	value: number;
};

export type CategoryStatistic = {
	category: string;
	value: number;
};
