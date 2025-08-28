export function relativeTime(value: string, lang: string = 'es-ES'): string {
	if (!value) return '';

	const date = new Date(value);
	const timeMs = date.getTime();

	if (!isFinite(timeMs)) return '';

	const deltaSeconds = Math.round((timeMs - Date.now()) / 1000);
	const cutoffs = [60, 3600, 86400, 86400 * 7, 86400 * 30, 86400 * 365, Infinity];
	const units = ['second', 'minute', 'hour', 'day', 'week', 'month', 'year'];

	const unitIndex = cutoffs.findIndex((cutoff) => cutoff > Math.abs(deltaSeconds));

	if (unitIndex === -1) return '';

	const divisor = unitIndex > 0 ? cutoffs[unitIndex - 1] : 1;
	const rtf = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' });
	const valueToFormat = Math.floor(deltaSeconds / divisor);

	if (!isFinite(valueToFormat)) return '';

	return rtf.format(valueToFormat, units[unitIndex] as Intl.RelativeTimeFormatUnit);
}
