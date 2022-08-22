import { ApplyOptions } from '@sapphire/decorators';
import { Events, InteractionHandlerParseError, Listener } from '@sapphire/framework';

import { interactionErrorHandler } from '#utils/functions/errorHandler';

@ApplyOptions<Listener.Options>({
	name: 'InteractionHandlerParser',
	event: Events.InteractionHandlerParseError
})
export class BotListener extends Listener<typeof Events.InteractionHandlerError> {
	public run(error: Error, payload: InteractionHandlerParseError) {
		return interactionErrorHandler(error, payload);
	}
}
