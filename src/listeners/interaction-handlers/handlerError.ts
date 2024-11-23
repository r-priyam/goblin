import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener } from '@sapphire/framework';

import { interactionErrorHandler } from '#utils/functions/errorHandler';

import type { InteractionHandlerError } from '@sapphire/framework';

@ApplyOptions<Listener.Options>({
	name: 'InteractionHandlerError',
	event: Events.InteractionHandlerError
})
export class BotListener extends Listener<typeof Events.InteractionHandlerError> {
	public async run(error: Error, payload: InteractionHandlerError) {
		return interactionErrorHandler(error, payload);
	}
}
