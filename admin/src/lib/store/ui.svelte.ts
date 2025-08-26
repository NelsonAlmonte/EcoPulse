import type { PageHeader, ToastProps } from '$lib/types/ui.type';

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

export const toastState = $state<ToastProps>({
	content: 'Example toast',
	color: 'green',
	icon: 'Calendar'
});
