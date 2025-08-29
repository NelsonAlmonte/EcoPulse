import type { icons } from '$lib/constants/icons.constant';

export type AlertTypes = {
	error: AlertProps;
	no_data: AlertProps;
	empty: AlertProps;
};

export type AlertProps = {
	title: string;
	content: string;
	subcontent: string;
	classes: string[];
};

export type TitleProps = {
	title: string;
	shadow_color: string;
};

export type NavTabProps = {
	title: string;
	base_url: string;
	route: string;
	icon: IconKey;
};

export type IconKey = keyof typeof icons;

export type PageHeader = {
	title: string;
	back_url?: string;
	breadcrumbs?: Breadcrumb[];
};

type Breadcrumb = {
	title: string;
	url: string;
};

export type ToastProps = {
	content: string;
	color: FlowbiteColor;
	icon: IconKey;
};

export type FlowbiteColor =
	| 'primary'
	| 'gray'
	| 'red'
	| 'orange'
	| 'amber'
	| 'yellow'
	| 'lime'
	| 'green'
	| 'emerald'
	| 'teal'
	| 'cyan'
	| 'sky'
	| 'blue'
	| 'indigo'
	| 'violet'
	| 'purple'
	| 'fuchsia'
	| 'pink'
	| 'rose';

export type StatusOption = {
	label: string;
	color: FlowbiteColor;
	icon: IconKey;
};
