import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener } from '@sapphire/framework';
import type { InteractionHandlerParseError } from '@sapphire/framework';
import { interactionErrorHandler } from '#utils/functions/errorHandler';

@ApplyOptions<Listener.Options>({
	name: 'InteractionHandlerParser',
	event: Events.InteractionHandlerParseError
})
export class BotListener extends Listener<typeof Events.InteractionHandlerError> {
	public async run(error: Error, payload: InteractionHandlerParseError) {
		return interactionErrorHandler(error, payload);
	}
}
