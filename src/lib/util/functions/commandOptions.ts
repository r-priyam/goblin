import type { SlashCommandStringOption } from 'discord.js';

export function addTagOption(
	optionInstance:
		| Omit<SlashCommandStringOption, 'addChoices'>
		| Omit<SlashCommandStringOption, 'setAutocomplete'>
		| SlashCommandStringOption,
	options: TagProperties
) {
	return optionInstance
		.setName('tag')
		.setDescription(options.description!)
		.setRequired(options.required ?? false)
		.setAutocomplete(options.autoComplete ?? false);
}

export const clanTagOption = (optionInstance: SlashCommandStringOption, options: TagProperties) =>
	addTagOption(optionInstance, { description: 'Tag of the clan', ...options });

export const playerTagOption = (optionInstance: SlashCommandStringOption, options: TagProperties) =>
	addTagOption(optionInstance, {
		description: 'Tag of the player',
		...options
	});

type TagProperties = {
	/**
	 * Whether this option supports autocomplete
	 */
	autoComplete?: boolean;
	/**
	 * Description of the option
	 */
	description?: string;
	/**
	 * Whether this option is required
	 */
	required?: boolean;
};
