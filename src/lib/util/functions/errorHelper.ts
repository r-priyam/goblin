import { userMention } from '@discordjs/builders';
import { UserError } from '@sapphire/framework';
import { codeBlock } from '@sapphire/utilities';
import { RESTJSONErrorCodes } from 'discord-api-types/v9';
import { CommandInteraction, DiscordAPIError, HTTPError, Interaction, MessageEmbed } from 'discord.js';
import { Colors, Emotes } from '#utils/constants';

export const IgnoredCodes = new Set([RESTJSONErrorCodes.UnknownChannel, RESTJSONErrorCodes.UnknownMessage]);
export const UnidentifiedErrorMessage = `UH OH! Looks like something went wrong which I was not able to identify. Please report it to ${userMention(
	'292332992251297794'
)} with the command name you ran.`;

/**
 * Formats an error path line.
 * @param error The error to format.
 */
export function getPathLine(error: DiscordAPIError | HTTPError): string {
	return `**Path**: ${error.method.toUpperCase()} ${error.path}`;
}

/**
 * Formats an error code line.
 * @param error The error to format.
 */
export function getCodeLine(error: DiscordAPIError | HTTPError): string {
	return `**Code**: ${error.code}`;
}

/**
 * Formats an error codeblock.
 * @param error The error to format.
 */
export function getErrorLine(error: Error): string {
	return `**Error**: ${codeBlock('js', error.stack || error)}`;
}

export async function handleUserError(interaction: Interaction, error: UserError) {
	if (Reflect.get(Object(error.context), 'silent')) return;

	if (interaction.isCommand())
		return sendCommandErrorToUser(interaction, errorEmbedUser(error.message ?? UnidentifiedErrorMessage));
	return sendErrorToUser(interaction, errorEmbedUser(error.message ?? UnidentifiedErrorMessage));
}

export async function sendCommandErrorToUser(interaction: CommandInteraction, embed: MessageEmbed) {
	if (interaction.replied || interaction.deferred) {
		return interaction.editReply({ embeds: [embed] });
	}

	return interaction.reply({ embeds: [embed], ephemeral: true });
}

export async function sendErrorToUser(interaction: Interaction, embed: MessageEmbed) {
	if (!interaction.isSelectMenu() && !interaction.isButton() && !interaction.isModalSubmit()) return;

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
