import { ApplyOptions } from '@sapphire/decorators';
import { Precondition } from '@sapphire/framework';
import { envParseArray } from '@skyra/env-utilities';
import { CommandInteraction } from 'discord.js';

@ApplyOptions<Precondition.Options>({
	name: 'OwnerOnly'
})
export class UserPrecondition extends Precondition {
	public override async chatInputRun(interaction: CommandInteraction) {
		return envParseArray('OWNERS').includes(interaction.user.id)
			? this.ok()
			: this.error({ message: 'This command can only be used by the owner.' });
	}
}

declare module '@sapphire/framework' {
	// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
	interface Preconditions {
		OwnerOnly: never;
	}
}
