import { Util } from 'clashofclans.js';

import type Fuse from 'fuse.js';

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
	const validateTag = Util.isValidTag(formattedTag);

	return validateTag
		? [{ name: formattedTag, value: formattedTag }]
		: [{ name: `❌ ${formattedTag || tag} isn't a valid tag ❌`, value: tag }];
}

export function getFuzzyTagSuggestions(rawTag: string, matches: Fuse.FuseResult<{ name: string; tag: string }>[]) {
	const formattedTag = Util.formatTag(rawTag);
	const validateTag = Util.isValidTag(formattedTag);

	const result = matches
		.map((fuzzy) => ({
			name: `${fuzzy.item.name} (${fuzzy.item.tag})`,
			value: fuzzy.item.tag
		}))
		.slice(0, 14);

	// TODO: there's a possible bug here to skip the suggestions for clan name
	if (validateTag && result[0].value === Util.formatTag(String(rawTag))) return result;

	if (validateTag) result.unshift({ name: formattedTag, value: formattedTag });
	return result;
}
