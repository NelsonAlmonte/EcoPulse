import type { PageHeader, ToastProps } from '$lib/types/ui.type';

export const modalState = $state({
	search: {
		isOpen: false
	}
});

export const sidebarState = $state({
	canShow: false
});

export const themeState = $state({
	theme: 'light'
});

export const pageHeaderState = $state<PageHeader>({
	title: '',
	breadcrumbs: []
});

class ToastState {
	#toastProps = $state<ToastProps>({
		content: 'Example toast',
		color: 'green',
		icon: 'Calendar'
	});
	counter = 6;
	toastStatus = $state(false);

	get toast() {
		return this.#toastProps;
	}

	set toast(value: ToastProps) {
		this.#toastProps = value;
	}

	trigger(toastProps: ToastProps) {
		this.#toastProps = toastProps;
		this.toastStatus = true;
		this.counter = 6;
		this.timeout();
	}

	timeout() {
		if (--this.counter > 0) return setTimeout(() => this.timeout(), 1000);
		this.toastStatus = false;
	}
}

export const toastState = new ToastState();
