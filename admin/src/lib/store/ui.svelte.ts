import type { PageHeader } from '$lib/types/ui.type';

export const modalState = $state({
	search: {
		isOpen: false
	}
});

export const navbarState = $state({
	isHidden: true
});

export const themeState = $state({
	theme: 'light'
});

export const pageHeaderState = $state<PageHeader>({
	title: '',
	breadcrumbs: []
});
