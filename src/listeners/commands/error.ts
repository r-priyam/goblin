import { ApplyOptions } from '@sapphire/decorators';
import { ChatInputCommandErrorPayload, Events, Listener } from '@sapphire/framework';
import { ChatInputSubcommandErrorPayload, SubcommandPluginEvents } from '@sapphire/plugin-subcommands';
import type { ChatInputCommandInteraction } from 'discord.js';
import { commandErrorHandler } from '#utils/functions/errorHandler';

@ApplyOptions<Listener.Options>({
	name: 'ChatInputCommandError',
	event: Events.ChatInputCommandError
})
export class UserListener extends Listener<typeof Events.ChatInputCommandError> {
	public run(error: Error, { interaction }: ChatInputCommandErrorPayload) {
		return commandErrorHandler(error, interaction as ChatInputCommandInteraction<'cached'>);
	}
}

@ApplyOptions<Listener.Options>({
	name: 'ChatInputSubcommandError',
	event: SubcommandPluginEvents.ChatInputSubcommandError
})
export class SubUserListener extends Listener<typeof SubcommandPluginEvents.ChatInputSubcommandError> {
	public run(error: Error, { interaction }: ChatInputSubcommandErrorPayload) {
		return commandErrorHandler(error, interaction as ChatInputCommandInteraction<'cached'>);
	}
}
