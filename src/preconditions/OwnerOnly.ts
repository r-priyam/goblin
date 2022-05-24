import { ApplyOptions } from '@sapphire/decorators';
import { Precondition } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';

import config from '#root/config';

@ApplyOptions<Precondition.Options>({
	name: 'OwnerOnly'
})
export class UserPrecondition extends Precondition {
	public override async chatInputRun(interaction: CommandInteraction) {
		return config.bot.owners!.includes(interaction.user.id) ? this.ok() : this.error({ message: 'This command can only be used by the owner.' });
	}
}

declare module '@sapphire/framework' {
	interface Preconditions {
		OwnerOnly: never;
	}
}
