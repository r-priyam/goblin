import type { UserError } from '@sapphire/framework';
import { codeBlock } from '@sapphire/utilities';
import { RESTJSONErrorCodes } from 'discord-api-types/v10';
import {
	ChatInputCommandInteraction,
	DiscordAPIError,
	HTTPError,
	Interaction,
	EmbedBuilder,
	userMention
} from 'discord.js';
import { Colors, Emotes } from '#utils/constants';

export const IgnoredCodes = new Set([RESTJSONErrorCodes.UnknownChannel, RESTJSONErrorCodes.UnknownMessage]);
export const UnidentifiedErrorMessage = `UH OH! Looks like something went wrong which I was not able to identify. Please report it to ${userMention(
	'292332992251297794'
)} with the command name you ran.`;

/**
 * Formats an error path line.
 *
 * @param error - The error to format.
 */
export function getPathLine(error: DiscordAPIError | HTTPError): string {
	return `**Path**: ${error.method.toUpperCase()} ${error.url}`;
}

/**
 * Formats an error code line.
 *
 * @param error - The error to format.
 */
export function getCodeLine(error: DiscordAPIError | HTTPError): string {
	return `**Code**: ${error.status}`;
}

/**
 * Formats an error codeblock.
 *
 * @param error - The error to format.
 */
export function getErrorLine(error: Error): string {
	return `**Error**: ${codeBlock('js', error.stack ?? error)}`;
}

export async function handleUserError(interaction: Interaction, error: UserError) {
	if (Reflect.get(Object(error.context), 'silent')) return;

	if (interaction.isCommand()) {
		await sendCommandErrorToUser(
			interaction as ChatInputCommandInteraction<'cached'>,
			errorEmbedUser(error.message ?? UnidentifiedErrorMessage)
		);
	}

	await sendErrorToUser(interaction, errorEmbedUser(error.message ?? UnidentifiedErrorMessage));
}

export async function sendCommandErrorToUser(interaction: ChatInputCommandInteraction<'cached'>, embed: EmbedBuilder) {
	if (interaction.replied || interaction.deferred) {
		return interaction.editReply({ embeds: [embed] });
	}

	return interaction.reply({ embeds: [embed], ephemeral: true });
}

export async function sendErrorToUser(interaction: Interaction, embed: EmbedBuilder) {
	if (!interaction.isSelectMenu() && !interaction.isButton() && !interaction.isModalSubmit()) return;

	if (interaction.replied || interaction.deferred) {
		await interaction.editReply({ embeds: [embed] });
	}

	await interaction.reply({ embeds: [embed], ephemeral: true });
}

export function errorEmbedUser(message: string) {
	return new EmbedBuilder().setTitle(`${Emotes.Error} Error`).setDescription(message).setColor(Colors.Red);
}

export function getWarnError(interaction: Interaction) {
	return `ERROR: /${interaction.guild!.id}/${interaction.channel!.id}/${interaction.id}`;
}
