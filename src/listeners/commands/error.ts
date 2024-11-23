import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener } from '@sapphire/framework';
import { SubcommandPluginEvents } from '@sapphire/plugin-subcommands';

import { commandErrorHandler } from '#utils/functions/errorHandler';

import type { ChatInputCommandErrorPayload } from '@sapphire/framework';
import type { ChatInputSubcommandErrorPayload } from '@sapphire/plugin-subcommands';

@ApplyOptions<Listener.Options>({
	name: 'ChatInputCommandError',
	event: Events.ChatInputCommandError
})
export class UserListener extends Listener<typeof Events.ChatInputCommandError> {
	public async run(error: Error, { interaction }: ChatInputCommandErrorPayload) {
		return commandErrorHandler(error, interaction);
	}
}

@ApplyOptions<Listener.Options>({
	name: 'ChatInputSubcommandError',
	event: SubcommandPluginEvents.ChatInputSubcommandError
})
export class SubUserListener extends Listener<typeof SubcommandPluginEvents.ChatInputSubcommandError> {
	public async run(error: Error, { interaction }: ChatInputSubcommandErrorPayload) {
		return commandErrorHandler(error, interaction);
	}
}
