import { ApplyOptions } from '@sapphire/decorators';
import { ChatInputCommandErrorPayload, Events, Listener } from '@sapphire/framework';
import { commandErrorHandler } from '#utils/functions/errorHandler';

@ApplyOptions<Listener.Options>({
	name: 'ChatInputCommandError',
	event: Events.ChatInputCommandError
})
export class UserListener extends Listener<typeof Events.ChatInputCommandError> {
	public run(error: Error, { interaction }: ChatInputCommandErrorPayload) {
		return commandErrorHandler(error, interaction);
	}
}
