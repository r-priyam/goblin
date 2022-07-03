import { ApplyOptions } from '@sapphire/decorators';
import type { ChatInputCommand } from '@sapphire/framework';

import { GoblinCommand } from '#lib/extensions/GoblinCommand';

@ApplyOptions<ChatInputCommand.Options>({
	description: 'Returns the EYG server invite link'
})
export class ServerInvite extends GoblinCommand {
	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description), {
			idHints: ['993241403985506424', '993241985576075295']
		});
	}

	public override async chatInputRun(interaction: ChatInputCommand.Interaction<'cached'>) {
		return interaction.reply({ content: 'http://discord.me/eygcommunity' });
	}
}
