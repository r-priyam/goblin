export function humanizeNumber(num: number) {
	if (num > 999 && num < 1_000_000) {
		return `${(num / 1000).toFixed(1)}K`;
	} else if (num > 1_000_000 && num < 1_000_000_000) {
		return `${(num / 1_000_000).toFixed(1)}M`;
	} else if (num >= 1_000_000_000) {
		return `${(num / 1_000_000_000).toFixed(1)}B`;
	}

	return num;
}
