import { Util } from 'clashofclans.js';
import type Fuse from 'fuse.js';

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

export function handleNoValue(cachedData: { name: string; tag: string }[]) {
	return cachedData
		.map((data) => ({
			name: `${data.name} (${data.tag})`,
			value: data.tag
		}))
		.slice(0, 14);
}

export function handleNoFuzzyMatch(tag: string) {
	const formattedTag = Util.formatTag(String(tag));
	const validateTag = Util.isValidTag(tag);

	return validateTag ? [{ name: formattedTag, value: formattedTag }] : [{ name: `❌ ${tag} isn't a valid tag ❌`, value: tag }];
}

export function getFuzzyTagSuggestions(rawTag: string, matches: Fuse.FuseResult<{ name: string; tag: string }>[]) {
	const formattedTag = Util.formatTag(String(rawTag));
	const validateTag = Util.isValidTag(formattedTag);

	const result = matches
		.map((fuzzy) => ({
			name: `${fuzzy.item.name} (${fuzzy.item.tag})`,
			value: fuzzy.item.tag
		}))
		.slice(0, 14);

	if (validateTag && result[0].value === Util.formatTag(String(rawTag))) {
		return result;
	}

	validateTag && result.unshift({ name: formattedTag, value: formattedTag });
	return result;
}
