export function parseArmyLink(link: string) {
	const units: { troopId: number; count: number }[] = [];
	const spells: { spellId: number; count: number }[] = [];

	const matches = link.matchAll(/u(?<units>[\d+x-]+)|s(?<spells>[\d+x-]+)/g);

	for (const match of matches) {
		if (match.groups?.units) {
			for (const unit of match.groups.units.split('-')) {
				const [count, troopId] = unit.split('x').map((e) => Number(e));
				units.push({ count, troopId });
			}
		}

		if (match.groups?.spells) {
			for (const spell of match.groups.spells.split('-')) {
				const [count, spellId] = spell.split('x').map((e) => Number(e));
				spells.push({ count, spellId });
			}
		}
	}

	return { units, spells };
}
