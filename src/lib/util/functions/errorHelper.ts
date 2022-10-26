import { userMention } from '@discordjs/builders';
import { codeBlock } from '@sapphire/utilities';
import { RESTJSONErrorCodes } from 'discord-api-types/v9';
import { MessageEmbed } from 'discord.js';

import type { UserError } from '@sapphire/framework';
import type { CommandInteraction, DiscordAPIError, HTTPError, Interaction } from 'discord.js';

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
	return `**Path**: ${error.method.toUpperCase()} ${error.path}`;
}

/**
 * Formats an error code line.
 *
 * @param error - The error to format.
 */
export function getCodeLine(error: DiscordAPIError | HTTPError): string {
	return `**Code**: ${error.code}`;
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

	if (interaction.isCommand())
		await sendCommandErrorToUser(interaction, errorEmbedUser(error.message ?? UnidentifiedErrorMessage));
	await sendErrorToUser(
		interaction,
		errorEmbedUser(error.message ?? UnidentifiedErrorMessage),
		Reflect.get(Object(error.context), 'followUp')
	);
}

export async function sendCommandErrorToUser(interaction: CommandInteraction, embed: MessageEmbed) {
	if (interaction.replied || interaction.deferred) {
		return interaction.editReply({ embeds: [embed] });
	}

	return interaction.reply({ embeds: [embed], ephemeral: true });
}

export async function sendErrorToUser(interaction: Interaction, embed: MessageEmbed, followUp = false) {
	if (!interaction.isSelectMenu() && !interaction.isButton() && !interaction.isModalSubmit()) return;

	if (followUp) {
		return interaction.followUp({ embeds: [embed], ephemeral: true });
	}

	if (interaction.replied || interaction.deferred) {
		return interaction.editReply({ embeds: [embed] });
	}

	return interaction.reply({ embeds: [embed], ephemeral: true });
}

export function errorEmbedUser(message: string) {
	return new MessageEmbed().setTitle(`${Emotes.Error} Error`).setDescription(message).setColor(Colors.Red);
}

export function getWarnError(interaction: Interaction) {
	return `ERROR: /${interaction.guild!.id}/${interaction.channel!.id}/${interaction.id}`;
}
