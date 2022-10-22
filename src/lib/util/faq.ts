import { readFile } from 'node:fs/promises';
import { URL } from 'node:url';

import { parse as parseToml } from '@ltd/j-toml';
import { Collection } from 'discord.js';

import type { FAQ } from '#lib/types/Faqs';

export const faqsCache = new Collection<string, FAQ>();

export async function loadFAQs() {
	const file = await readFile(new URL('../../../meta/faqs.toml', import.meta.url), 'utf8');
	const data = parseToml(file, 1, '\n');

	for (const [key, value] of Object.entries(data)) {
		faqsCache.set(key, value as unknown as FAQ);
	}
}
