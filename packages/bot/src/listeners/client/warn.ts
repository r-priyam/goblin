import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener } from '@sapphire/framework';

@ApplyOptions<Listener.Options>({
	name: 'ClientWarn',
	event: Events.Warn
})
export class BorListener extends Listener<typeof Events.Warn> {
	public override run(message: string) {
		this.logger.warn(message);
	}
}
