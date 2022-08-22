import { userMention } from '@discordjs/builders';
import { container, Events, InteractionHandlerError, InteractionHandlerParseError, UserError } from '@sapphire/framework';
import { RESTJSONErrorCodes } from 'discord-api-types/rest/v10';
import { DiscordAPIError, HTTPError, Interaction, MessageEmbed } from 'discord.js';

import { Colors, Emotes } from '#utils/constants';

const IgnoredCodes = new Set([RESTJSONErrorCodes.UnknownChannel, RESTJSONErrorCodes.UnknownMessage]);
const UnidentifiedErrorMessage = `UH OH! Looks like something went wrong which I was not able to identify. Please report it to ${userMention(
	'292332992251297794'
)} with the command name you ran.`;

export async function interactionErrorHandler(error: Error, { interaction }: InteractionHandlerError | InteractionHandlerParseError) {
	if (typeof error === 'string') return sendErrorToUser(interaction, errorEmbedUser(error));
	if (error instanceof UserError) return handleUserError(interaction, error);

	const { client, logger } = container;

	if (error.name === 'AbortError' || error.message === 'Internal Server Error') {
		logger.warn(`${getWarnError(interaction)} (${interaction.user.id}) | ${error.constructor.name}`);
		return sendErrorToUser(interaction, errorEmbedUser('I had a small network error when messaging Discord. Please run this command again!'));
	}

	if (error instanceof DiscordAPIError || error instanceof HTTPError) {
		if (IgnoredCodes.has(error.code)) return;

		client.emit(Events.Error, error);
	} else {
		logger.warn(`${getWarnError(interaction)} (${interaction.user.id}) | ${error.constructor.name}`);
	}

	// TODO: More detailed handling, I need to analyze
}

async function handleUserError(interaction: Interaction, error: UserError) {
	if (Reflect.get(Object(error.context), 'silent')) return;

	return sendErrorToUser(interaction, errorEmbedUser(error.message ?? UnidentifiedErrorMessage));
}

async function sendErrorToUser(interaction: Interaction, embed: MessageEmbed) {
	if (!interaction.isSelectMenu() && !interaction.isButton() && !interaction.isModalSubmit()) return;

	if (interaction.replied || interaction.deferred) {
		return interaction.editReply({ embeds: [embed] });
	}

	return interaction.reply({ embeds: [embed], ephemeral: true });
}

function errorEmbedUser(message: string) {
	return new MessageEmbed().setTitle(`${Emotes.Error} Error`).setDescription(message).setColor(Colors.Red);
}

function getWarnError(interaction: Interaction) {
	return `ERROR: /${interaction.guild!.id}/${interaction.channel!.id}/${interaction.id}`;
}
