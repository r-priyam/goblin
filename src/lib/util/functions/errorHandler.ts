/* eslint-disable consistent-return */
// TODO: Get a better error handler

import {
	container,
	Events,
	InteractionHandlerError,
	InteractionHandlerParseError,
	UserError
} from '@sapphire/framework';
import { ChatInputCommandInteraction, DiscordAPIError, HTTPError } from 'discord.js';
import {
	errorEmbedUser,
	getWarnError,
	handleUserError,
	IgnoredCodes,
	sendCommandErrorToUser,
	sendErrorToUser
} from '#utils/functions/errorHelper';

export async function commandErrorHandler(error: Error, interaction: ChatInputCommandInteraction<'cached'>) {
	if (typeof error === 'string') return sendCommandErrorToUser(interaction, errorEmbedUser(error));
	if (error instanceof UserError) return handleUserError(interaction, error);

	const { client, logger } = container;

	if (error.name === 'AbortError' || error.message === 'Internal Server Error') {
		logger.warn(`${getWarnError(interaction)} (${interaction.user.id}) | ${error.constructor.name}`);
		return sendErrorToUser(
			interaction,
			errorEmbedUser('I had a small network error when messaging Discord. Please run this command again!')
		);
	}

	if (error instanceof DiscordAPIError || error instanceof HTTPError) {
		if (IgnoredCodes.has(error.status)) return;

		client.emit(Events.Error, error);
	} else {
		logger.warn(`${getWarnError(interaction)} (${interaction.user.id}) | ${error.constructor.name}`);
	}

	logger.error(error);
	return sendCommandErrorToUser(
		interaction,
		errorEmbedUser('Something went wrong. I have reported it to my developer')
	);
}

export function interactionErrorHandler(
	error: Error,
	{ interaction }: InteractionHandlerError | InteractionHandlerParseError
) {
	if (typeof error === 'string') return sendErrorToUser(interaction, errorEmbedUser(error));
	if (error instanceof UserError) return handleUserError(interaction, error);

	const { client, logger } = container;

	if (error.name === 'AbortError' || error.message === 'Internal Server Error') {
		logger.warn(`${getWarnError(interaction)} (${interaction.user.id}) | ${error.constructor.name}`);
		return sendErrorToUser(
			interaction,
			errorEmbedUser('I had a small network error when messaging Discord. Please run this command again!')
		);
	}

	if (error instanceof DiscordAPIError || error instanceof HTTPError) {
		if (IgnoredCodes.has(error.status)) return;

		client.emit(Events.Error, error);
	} else {
		logger.warn(`${getWarnError(interaction)} (${interaction.user.id}) | ${error.constructor.name}`);
	}

	logger.error(error);
	return sendErrorToUser(interaction, errorEmbedUser('Something went wrong. I have reported it to my developer'));
}
