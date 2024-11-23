import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener } from '@sapphire/framework';
import { EmbedBuilder } from 'discord.js';

import type { ChatInputCommandDeniedPayload, UserError } from '@sapphire/framework';

import { Colors } from '#utils/constants';

@ApplyOptions<Listener.Options>({
	name: 'ChatInputCommandDenied',
	event: Events.ChatInputCommandDenied
})
export class ChatInputCommandDenied extends Listener<typeof Events.ChatInputCommandDenied> {
	public override async run({ context, message }: UserError, { interaction }: ChatInputCommandDeniedPayload) {
		if (Reflect.get({ context }, 'silent')) {
			return;
		}

		await interaction.reply({
			embeds: [
				new EmbedBuilder() //
					.setTitle('Error')
					.setDescription(message)
					.setColor(Colors.Red)
			],
			ephemeral: true
		});
	}
}
