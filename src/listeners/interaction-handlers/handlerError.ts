import { ApplyOptions } from '@sapphire/decorators';
import { Events, InteractionHandlerError, Listener } from '@sapphire/framework';
import { interactionErrorHandler } from '#utils/functions/errorHandler';

@ApplyOptions<Listener.Options>({
	name: 'InteractionHandlerError',
	event: Events.InteractionHandlerError
})
export class BotListener extends Listener<typeof Events.InteractionHandlerError> {
	public run(error: Error, payload: InteractionHandlerError) {
		return interactionErrorHandler(error, payload);
	}
}
