import type { SlashCommandStringOption } from 'discord.js';

/**
 * Generate ClanTag or PlayerTag SlashCommandString option
 *
 * @param optionInstance  - {@link SlashCommandStringOption}
 * @param options - {@link TagProperties}
 * @defaultValue `required: false` and `autoComplete: false`
 * @returns - {@link SlashCommandStringOption}
 */
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

/**
 * Generate ClanTag SlashCommandString option
 *
 * @param optionInstance  - {@link SlashCommandStringOption}
 * @param options - {@link TagProperties}
 * @defaultValue `required: false` and `autoComplete: false`
 * @returns - {@link SlashCommandStringOption}
 */
export const clanTagOption = (optionInstance: SlashCommandStringOption, options: TagProperties) =>
	addTagOption(optionInstance, { description: 'Tag of the clan', ...options });

/**
 * Generate PlayerTag SlashCommandString option
 *
 * @param optionInstance  - {@link SlashCommandStringOption}
 * @param options - {@link TagProperties}
 * @defaultValue `required: false` and `autoComplete: false`
 * @returns - {@link SlashCommandStringOption}
 */
export const playerTagOption = (optionInstance: SlashCommandStringOption, options: TagProperties) =>
	addTagOption(optionInstance, { description: 'Tag of the player', ...options });

interface TagProperties {
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
}
