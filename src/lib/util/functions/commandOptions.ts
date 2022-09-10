import { SlashCommandStringOption } from '@discordjs/builders';

/**
 * Generate ClanTag or PlayerTag SlashCommandString option
 *
 * @param options - {@link ClanOrPlayerOptions}
 * @defaultValue `required: false` and `autoComplete: false`
 * @returns - {@link SlashCommandStringOption}
 */
export function addClanOrPlayerOption(options: ClanOrPlayerOptions) {
	return new SlashCommandStringOption()
		.setName('tag')
		.setDescription(`Tag of the ${options.name}`)
		.setRequired(options.required ?? false)
		.setAutocomplete(options.autoComplete ?? false);
}

/**
 * Generate ClanTag SlashCommandString option
 *
 * @param options - {@link ClanOrPlayerOptions}
 * @defaultValue `required: false` and `autoComplete: false`
 * @returns - {@link SlashCommandStringOption}
 */
export const clanOption = (options: ClanOrPlayerOptions) => addClanOrPlayerOption({name: 'clan', ...options});

/**
 * Generate PlayerTag SlashCommandString option
 *
 * @param options - {@link ClanOrPlayerOptions}
 * @defaultValue `required: false` and `autoComplete: false`
 * @returns - {@link SlashCommandStringOption}
 */
export const playerOption = (options: ClanOrPlayerOptions) => addClanOrPlayerOption({ name: 'player', ...options });

type ClanOrPlayerOptions = {
	/**
	 * Whether this option supports autocomplete
	 */
	autoComplete?: boolean;
	/**
	 * Name of the parameter, whether clan or player
	 */
	name?: string;
	/**
	 * Whether this option is required
	 */
	required?: boolean;
};
