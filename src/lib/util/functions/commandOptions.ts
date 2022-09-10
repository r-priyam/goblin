import { SlashCommandStringOption } from '@discordjs/builders';

/**
 * Generate ClanTag or PlayerTag SlashCommandString option
 *
 * @param options - {@link TagProperties}
 * @defaultValue `required: false` and `autoComplete: false`
 * @returns - {@link SlashCommandStringOption}
 */
export function addTagOption(options: TagProperties) {
	return new SlashCommandStringOption()
		.setName('tag')
		.setDescription(options.description!)
		.setRequired(options.required ?? false)
		.setAutocomplete(options.autoComplete ?? false);
}

/**
 * Generate ClanTag SlashCommandString option
 *
 * @param options - {@link TagProperties}
 * @defaultValue `required: false` and `autoComplete: false`
 * @returns - {@link SlashCommandStringOption}
 */
export const clanTagOption = (options: TagProperties) => addTagOption({ description: 'Tag of the clan', ...options });

/**
 * Generate PlayerTag SlashCommandString option
 *
 * @param options - {@link TagProperties}
 * @defaultValue `required: false` and `autoComplete: false`
 * @returns - {@link SlashCommandStringOption}
 */
export const playerTagOption = (options: TagProperties) =>
	addTagOption({ description: 'Tag of the player', ...options });

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
